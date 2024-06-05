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
      height: 50%;
      display: block;
      position: absolute;
      top: 20%;
      right: 27%;
    "
  >
    <dl>
      <dt><strong>학습자료</strong></dt>
      <dd class="content">
        <table class="row">
          <tbody>
            <tr>
              <th scope="row">제목<span class="font_red">*</span></th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  ref="title"
                  v-model="detailLearnMat.learnTitle"
                />
              </td>
              <th scope="row">등록일자</th>
              <td colspan="3">
                <input
                  type="text"
                  class="inputTxt p100"
                  v-model="detailLearnMat.writeDate"
                  readonly
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
  props: ["getSearchLearnMatList", "detailModalProps", "currentPage"],
  data() {
    return {
      detailLearnMat: {},
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

    updateLearningMatDetail() {
      let checkResult = nullcheck([
        { inval: this.$refs.title.value, msg: "제목을 입력해 주세요." },
        { inval: this.$refs.content.value, msg: "내용을 입력해 주세요." },
      ]);

      if (!checkResult) return;

      let param = new URLSearchParams();
      param.append("learnMatId", this.detailModalProps);
      param.append("updateLearnTitle", this.$refs.title.value);
      param.append("updateLearnContent", this.$refs.content.value);

      const file = this.$refs.fileRef.files[0];

      if (file) {
        param.append("updateFile", file);
      }

      axios.post("/tut/updateLearnMat.do", param).then((res) => {
        if (res.data) {
          alert("수정이 완료 되었습니다.");
          this.$emit("closeModal", false);
          this.getSearchLearnMatList(this.currentPage);
        } else {
          alert("수정을 실패했습니다.");
        }
      });
    },

    deleteLearningMatDetail() {
      axios
        .get(`/tut/deleteLearnMat.do/${this.detailModalProps}`)
        .then((res) => {
          if (res.data) {
            alert("학습자료가 삭제되었습니다.");
            this.$emit("closeModal", false);
            this.getSearchLearnMatList();
          }
        });
    },
  },
  mounted() {
    this.detailModalProps ? this.getLearningMatDetail() : null;
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
</style>
