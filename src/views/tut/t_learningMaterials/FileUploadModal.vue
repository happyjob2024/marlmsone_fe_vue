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
                <input type="text" class="inputTxt p100" ref="title" />
              </td>
            </tr>
            <tr id="lectureList">
              <th>강의목록<span class="font_red">*</span></th>
              <td>
                <select id="lecture_value">
                  <option
                    v-for="lec in lecList"
                    :key="lec.lec_id"
                    :value="lec.lec_id"
                  >
                    {{ lec.lec_name }}
                  </option>
                </select>
              </td>
              <th scope="row">등록일자</th>
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
                ></textarea>
              </td>
            </tr>
            <tr>
              <th scope="row">첨부파일<span class="font_red">*</span></th>
              <td colspan="6">
                <input type="file" ref="fileRef" />
                <div v-if="this.lectureValue > 0" style="margin: 5px">
                  <a class="pointer" style="text-decoration: none">{{
                    detailLearnMat.materials_orginal_fname
                  }}</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a class="btnType blue pointer" @click="saveLearningMatDetail"
            ><span>저장</span></a
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
  data() {
    return {
      lectureList: [],
      lecList: [],
      registrationDate: "",
    };
  },
  methods: {
    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    // 학습자료 등록
    saveLearningMatDetail() {
      let checkResult = nullcheck([
        { inval: this.$refs.title.value, msg: "제목을 입력해 주세요." },
        { inval: this.$refs.content.value, msg: "내용을 입력해 주세요." },
        { inval: this.$refs.fileRef.value, msg: "파일을 추가해 주세요." },
      ]);

      if (!checkResult) return;

      let param = new FormData();

      const lectureValue = document.getElementById("lecture_value").value;

      param.append("lecture_value", lectureValue);
      param.append("title", this.$refs.title.value);
      param.append("content", this.$refs.content.value);
      param.append("file", this.$refs.fileRef.files[0]);

      axios.post("/tut/saveLearningMaterials.do", param).then((res) => {
        if (res.data) {
          alert("학습 자료가 등록 되었습니다.");
          this.$emit("closeAndreload", lectureValue);
        } else {
          alert("학습 자료 등록에 실패했습니다. 다시 등록해주세요.");
        }
      });
    },

    getLectureList() {
      axios.get("/tut/t_learningMaterialsReact").then((res) => {
        this.lecList = res.data.lectureList;
      });
    },
  },
  mounted() {
    this.getLectureList();
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
