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
      <dt><strong>학습자료</strong></dt>
      <dd class="contain">
        <table class="row2">
          <tbody>
            <tr>
              <th scope="row">제목<span class="font_red">*</span></th>
              <td colspan="6">
                <input
                  type="text"
                  class="inputTxt p100"
                  ref="title"
                  v-model="detailLearnMat.learnTitle"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">등록일자</th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="detailLearnMat.writeDate"
                  style="background-color: #e2e5e6"
                  readonly
                  disabled
                />
              </td>
              <th scope="row">수정일자</th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="registrationDate"
                  style="background-color: #e2e5e6"
                  readonly
                  disabled
                />
              </td>
            </tr>
            <tr>
              <th scope="row">자료내용<span class="font_red">*</span></th>
              <td colspan="6">
                <textarea
                  ref="content"
                  style="border: 0; resize: none"
                  v-model="detailLearnMat.learnContent"
                ></textarea>
              </td>
            </tr>
            <tr>
              <th scope="row">첨부파일<span class="font_red">*</span></th>
              <td colspan="6">
                <input type="file" ref="fileRef" />
                <div v-if="this.detailModalProps > 0" style="margin: 5px">
                  <a
                    class="pointer"
                    @click="fileDownload"
                    style="text-decoration: none"
                    >{{ detailLearnMat.materials_orginal_fname }}</a
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a class="btnType blue pointer" @click="updateLearningMatDetail"
            ><span>수정</span></a
          >
          <a class="btnType blue pointer" @click="deleteLearningMatDetail"
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
  props: ["detailModalProps", "currentPage"],
  data() {
    return {
      detailLearnMat: {},
      registrationDate: "",
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

    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    getLearningMatDetail() {
      axios
        .get(`/tut/getDetailLearnMat.do?learnDataId=${this.detailModalProps}`)
        .then((res) => {
          this.detailLearnMat = res.data.detailLearnMat;
          this.detailLearnMat.writeDate = this.formatDate(
            this.detailLearnMat.writeDate
          );
        });
    },

    fileDownload() {
      const param = new URLSearchParams();

      axios
        .post(
          `/tut/fileDownload/${this.detailLearnMat.materials_fname}`,
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

    // 학습자료 수정
    updateLearningMatDetail() {
      let checkResult = nullcheck([
        { inval: this.$refs.title.value, msg: "제목을 입력해 주세요." },
        { inval: this.$refs.content.value, msg: "내용을 입력해 주세요." },
      ]);

      if (!checkResult) return;

      let param = new FormData();
      param.append("learnMatId", this.detailModalProps);
      param.append("updateLearnTitle", this.$refs.title.value);
      param.append("updateLearnContent", this.$refs.content.value);

      const file = this.$refs.fileRef.files[0];

      if (file) {
        param.append("updateFile", file);
      }

      if (
        confirm("수정시 등록일자가 수정일자로 변경됩니다. 수정하시겠습니까?") ==
        true
      ) {
        axios.post("/tut/updateLearnMat.do", param).then((res) => {
          if (res.data) {
            alert("수정이 완료 되었습니다.");
            this.$emit("closeAndreload");
          } else {
            alert("수정을 실패했습니다.");
          }
        });
      } else {
        return false;
      }
    },

    // 학습자료 삭제
    deleteLearningMatDetail() {
      if (confirm("정말 삭제하시겠습니까?") == true) {
        axios
          .get(`/tut/deleteLearnMat.do/${this.detailModalProps}`)
          .then((res) => {
            if (res.data) {
              alert("학습자료가 삭제되었습니다.");
              this.$emit("closeAndreload");
            }
          });
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.detailModalProps ? this.getLearningMatDetail() : null;
    this.registrationDate = this.getCurrentDate();
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
