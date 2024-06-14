<template>
  <div
    id="mask"
    style="width: 100%; height: 100%; display: block; opacity: 0.5"
  ></div>
  <div
    id="submitResult"
    class="layerPop layerType2"
    style="width: 600px; top: 35%; left: 35%; display: block"
  >
    <dl>
      <dt>
        <strong>제출 현황</strong>
        <input type="text" id="projectId" value="" hidden="" />
      </dt>
      <dd class="contain">
        <table class="col">
          <colgroup>
            <col width="20%" />
            <col width="45%" />
            <col width="15%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">학생 이름</th>
              <th scope="col">과제 제목</th>
              <th scope="col">파일</th>
              <th scope="col">제출일</th>
            </tr>
          </thead>
          <tbody id="studentProjectList">
            <template v-if="studentProjectList.length > 0">
              <tr v-for="list in studentProjectList" :key="list.projectId">
                <td>{{ list.student_name }}</td>

                <td>{{ list.submit_con }}</td>
                <td>
                  <a class="pointer" @click="fileDownload">다운로드</a>
                </td>
                <td>{{ formatDate(list.submit_date) }}</td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="4">과제가 존재하지 않습니다.</td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a class="btnType gray pointer" @click="$emit('closeModal', false)"
            ><span>닫기</span></a
          >
        </div>
      </dd>
    </dl>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["submitModalProps"],
  data() {
    return {
      studentProjectList: {},
    };
  },
  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(date));
    },

    getStudentProjectList() {
      axios
        .get(`/tut/showStudentProjectjson/${this.submitModalProps}`)
        .then((res) => {
          this.studentProjectList = res.data.studentProjectList;
          this.studentProjectList.submit_date = this.formatDate(
            this.studentProjectList.submit_date
          );
        });
    },

    fileDownload() {
      const param = new URLSearchParams();

      axios
        .post(
          `/tut/tutorProject/fileDownLoad/${this.submitModalProps}`,
          param,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          const fileName = res.headers["content-disposition"].split('"')[1];
          const reader = new FileReader();
          reader.readAsDataURL(new Blob([res.data]));
          reader.onloadend = () => {
            const a = document.createElement("a");
            a.href = reader.result;
            a.setAttribute("download", fileName);
            document.body.appendChild(a);
            a.click();
          };
        });
    },
  },
  mounted() {
    this.getStudentProjectList();
  },
};
</script>

<style></style>
