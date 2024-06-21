<template>
  <div
    id="mask"
    style="width: 100%; height: 100%; display: block; opacity: 0.5"
  ></div>
  <div
    id="mat_de"
    class="layerPop layerType2"
    style="
      width: 700px;
      display: block;
      height: 600px;
      position: fixed;
      top: 20%;
      left: 30%;
    "
  >
    <dl>
      <dt><strong>학생 정보</strong></dt>
      <dd class="contain">
        <table class="row3">
          <colgroup>
            <col width="15%" />
            <col width="35%" />
            <col width="15%" />
            <col width="35%" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">이름</th>
              <td>{{ studentInfoList.student_name }}</td>
              <th scope="row">성별</th>
              <td>
                {{ studentInfoList.student_sex === "M" ? "남" : "여" }}
              </td>
            </tr>
            <tr>
              <th scope="row">학번</th>
              <td>
                {{ studentInfoList.student_number }}
              </td>
              <th scope="row">ID</th>
              <td>{{ studentInfoList.std_id }}</td>
            </tr>
            <tr>
              <th scope="row">전화번호</th>
              <td>
                {{ studentInfoList.student_tel }}
              </td>
              <th scope="row">이메일</th>
              <td>{{ studentInfoList.student_mail }}</td>
            </tr>
            <tr>
              <th scope="row">주소</th>
              <td colspan="3">
                {{ studentInfoList.student_addr }}
              </td>
            </tr>
          </tbody>
        </table>
        <p class="lecTitle" id="searcharea">
          <span>수강 내역</span>
        </p>
        <div class="lecTable">
          <table class="col">
            <caption>
              caption
            </caption>
            <colgroup>
              <col width="15%" />
              <col width="50%" />
              <col width="35%" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">과정ID</th>
                <th scope="col">과정명</th>
                <th scope="col">기간</th>
              </tr>
            </thead>
            <tbody id="studentLecture">
              <tr id v-for="list in detailStudent" :key="list.lec_Id">
                <td>{{ list.lec_Id }}</td>
                <td>{{ list.lec_name }}</td>
                <td>
                  {{ formatDate(list.startDate) }} ~
                  {{ formatDate(list.endDate) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="btn_areaC mt30">
          <a class="btnType gray pointer" @click="$emit('closeModal', false)"
            ><span>취소</span></a
          >
        </div>
      </dd>
    </dl>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["studentModalProps"],
  data() {
    return {
      detailStudent: {},
      studentInfoList: {},
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

    getStudentDetail() {
      let param = new URLSearchParams();
      param.append("tutorId", sessionStorage.getItem("loginId"));
      param.append("studentId", this.studentModalProps);

      axios.post("/tut/lectureStudentDetail", param).then((res) => {
        this.detailStudent = res.data.detailTutorLecture;
        this.studentInfoList = res.data.detailTutorLecture[0];
      });
    },
  },
  mounted() {
    this.getStudentDetail();
  },
};
</script>

<style>
.lecTitle {
  font-family: "나눔바른고딕", NanumBarunGothic;
  line-height: 60px;
  font-size: 28px;
  font-weight: bold;
  margin: 5px 0 5px 0 !important;
}

/* 모달창 수강 내역 스크롤 */
.lecTable {
  max-height: 170px;
  overflow-y: auto;
}
</style>
