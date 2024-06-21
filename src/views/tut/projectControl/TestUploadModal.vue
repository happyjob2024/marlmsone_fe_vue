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
      <dd class="contain">
        <table class="row2">
          <tbody>
            <tr>
              <th scope="row">제목<span class="font_red">*</span></th>
              <td colspan="6">
                <input type="text" class="inputTxt p100" ref="title" />
              </td>
            </tr>
            <tr>
              <th scope="row">내용<span class="font_red">*</span></th>
              <td colspan="6">
                <input type="text" class="inputTxt p100" ref="content" />
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
                />
              </td>
            </tr>
            <tr>
              <th scope="row">파일<span class="font_red">*</span></th>
              <td colspan="6">
                <input type="file" ref="fileRef" />
                <div v-if="this.detailModalProps > 0" style="margin: 5px">
                  <span>{{ detailTutorProject.project_orginal_fname }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="btn_areaC mt30">
          <a class="btnType blue pointer" @click="saveProjectDetail()"
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
  props: ["uploadModalProps"],
  data() {
    return {
      lectureValue: 0,
    };
  },
  methods: {
    saveProjectDetail() {
      let checkResult = nullcheck([
        { inval: this.$refs.title.value, msg: "제목을 입력해 주세요." },
        { inval: this.$refs.content.value, msg: "내용을 입력해 주세요." },
        { inval: this.$refs.submitDate.value, msg: "제출일을 입력해 주세요." },
        {
          inval: this.$refs.deadLineDate.value,
          msg: "마감일을 입력해 주세요.",
        },
        { inval: this.$refs.fileRef.value, msg: "파일을 등록해 주세요." },
      ]);

      if (!checkResult) return;

      let param = new FormData();

      param.append("lectureValue", this.uploadModalProps);
      param.append("projectTitle", this.$refs.title.value);
      param.append("proejectContent", this.$refs.content.value);
      param.append("projectSubmitDate", this.$refs.submitDate.value);
      param.append("projectDeadLineDate", this.$refs.deadLineDate.value);
      param.append("file", this.$refs.fileRef.files[0]);

      axios.post("/tut/saveLectureProject", param).then((res) => {
        if (res.data) {
          alert("과제가 등록 되었습니다.");
          this.$emit("closeAndreload");
        } else {
          alert("과제 등록에 실패했습니다. 다시 등록해주세요.");
        }
      });
    },
  },
};
</script>

<style>
@import "../projectControl/TestModal.css";
</style>
