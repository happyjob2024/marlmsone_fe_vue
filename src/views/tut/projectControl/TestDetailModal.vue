<template>
  <div
    id="mask"
    style="width: 100%; height: 100%; display: block; opacity: 0.5"
  ></div>
  <div
    id="mat_de"
    class="layerPop layerType2"
    style="width: 700px; display: block; position: fixed; top: 25%; left: 30%"
  >
    <dl>
      <dt><strong>과제 등록</strong></dt>
      <dd class="con">
        <table class="row2">
          <tbody>
            <tr>
              <th scope="row">제목<span class="font_red">*</span></th>
              <td colspan="6">
                <input
                  type="text"
                  class="inputTxt p100"
                  ref="title"
                  v-model="detailTutorProject.projectTitle"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">내용<span class="font_red">*</span></th>
              <td colspan="6">
                <input
                  type="text"
                  class="inputTxt p100"
                  ref="content"
                  v-model="detailTutorProject.projectContent"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">시작일<span class="font_red">*</span></th>
              <td colspan="6">
                <input
                  type="date"
                  class="projectDate"
                  id="projectSubmitDate"
                  name="projectSubmitDate"
                  ref="submitDate"
                  v-model="detailTutorProject.startDate"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">마감일<span class="font_red">*</span></th>
              <td colspan="6">
                <input
                  type="date"
                  class="projectDate"
                  id="projectDeadLineDate"
                  name="projectDeadLineDate"
                  ref="deadLineDate"
                  v-model="detailTutorProject.deadLineDate"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">파일<span class="font_red"></span></th>
              <td colspan="6">
                <input type="file" ref="fileRef" />
                <div v-if="this.detailModalProps > 0" style="margin: 5px">
                  <a
                    class="pointer"
                    @click="fileDownload"
                    style="text-decoration: none"
                    >{{ detailTutorProject.project_orginal_fname }}</a
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a class="btnType blue pointer" @click="updateProjectDetail()"
            ><span>수정</span></a
          >
          <a class="btnType blue pointer" @click="deleteProjectDetail()"
            ><span>삭제</span></a
          >
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
import { nullcheck } from "@/common/common";

export default {
  props: ["tutorProjectList", "detailModalProps", "currentPage"],
  data() {
    return {
      detailTutorProject: {},
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

    getProjectDetail() {
      axios
        .get(
          `/tut/getDetailTutorProject?projectDateId=${this.detailModalProps}`
        )
        .then((res) => {
          this.detailTutorProject = res.data.detailTutorProject;
          this.detailTutorProject.startDate = this.formatDate(
            this.detailTutorProject.startDate
          );
          this.detailTutorProject.deadLineDate = this.formatDate(
            this.detailTutorProject.deadLineDate
          );
        });
    },

    fileDownload() {
      const param = new URLSearchParams();

      axios
        .post(
          `/tut/tutorProject/fileDownLoad/${this.detailModalProps}`,
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

    updateProjectDetail() {
      let checkResult = nullcheck([
        { inval: this.$refs.title.value, msg: "제목을 입력해 주세요." },
        { inval: this.$refs.content.value, msg: "내용을 입력해 주세요." },
        { inval: this.$refs.submitDate.value, msg: "제출일을 입력해 주세요." },
        {
          inval: this.$refs.deadLineDate.value,
          msg: "마감일을 입력해 주세요.",
        },
      ]);

      if (!checkResult) return;

      let param = new FormData();
      param.append("projectId", this.detailModalProps);
      param.append("updateProjectTitle", this.$refs.title.value);
      param.append("updateProjectContent", this.$refs.content.value);
      param.append("updateProjectSubmitDate", this.$refs.submitDate.value);
      param.append("updateProjectDeadLineDate", this.$refs.deadLineDate.value);

      const file = this.$refs.fileRef.files[0];

      if (file) {
        param.append("updateFile", file);
      }

      axios.post("/tut/updateTutorProject", param).then((res) => {
        if (res.data) {
          alert("과제 수정이 완료 되었습니다.");
          this.$emit("closeAndreload");
        } else {
          alert("과제 수정에 실패했습니다. 다시 확인해 주세요");
        }
      });
    },

    deleteProjectDetail() {
      axios
        .get(`/tut/deleteTutorProject/${this.detailModalProps}`)
        .then((res) => {
          if (res.data) {
            alert("과제가 삭제되었습니다.");
            this.$emit("closeAndreload");
          }
        });
    },
  },
  mounted() {
    this.detailModalProps ? this.getProjectDetail() : null;
  },
};
</script>

<style>
div.layerType2 {
  position: absolute;
  width: 400px;
  padding: 0px;
  margin: 0;
  border: 5px solid #c0c0c0;
  background-color: #f3f3f3;
  z-index: 9999;
  -moz-box-shadow: 2px 2px 3px #666;
  -webkit-box-shadow: 2px 2px 3px #666;
  box-shadow: 2px 2px 3px #666;
}

a.pointer {
  cursor: pointer;
}

table.row2 {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

div.layerType2 > dl dd table.row2 > tbody > tr > th {
  background: #bbc2cd;
}

div.layerType2 > dl dd {
  padding: 40px !important;
}
</style>
