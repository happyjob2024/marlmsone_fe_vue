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
      <dt><strong>강의 상세 정보</strong></dt>
      <dd class="contain">
        <table class="row3">
          <tbody>
            <tr>
              <th scope="row">강의명</th>
              <td id="lec_name">{{ detailTutorLecture.lec_name }}</td>
            </tr>
            <tr>
              <th scope="row">최대인원</th>
              <td id="maxCount">{{ detailTutorLecture.max_pnum }}명</td>
            </tr>
            <tr>
              <th scope="row">강사명</th>
              <td id="lectureTutor_name">
                {{ detailTutorLecture.tutor_name }}
              </td>
            </tr>
            <tr>
              <th scope="row">강의실</th>
              <td id="lecrm_name">{{ detailTutorLecture.lecrm_name }}</td>
            </tr>
            <tr>
              <th scope="row">과정일수</th>
              <td id="lec_processDay">
                {{ detailTutorLecture.process_day }}일
              </td>
            </tr>
            <tr>
              <th scope="row">시작일자</th>
              <td id="lec_startDay">{{ detailTutorLecture.start_date }}</td>
            </tr>
            <tr>
              <th scope="row">종료일자</th>
              <td id="lec_endDay">{{ detailTutorLecture.end_date }}</td>
            </tr>
          </tbody>
        </table>
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
  props: ["detailModalProps"],
  data() {
    return {
      detailTutorLecture: {},
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

    getLectureDetail() {
      let param = new URLSearchParams();
      param.append("tutorId", sessionStorage.getItem("loginId"));
      param.append("lectureId", this.detailModalProps);
      axios.post("/tut/tutorLectureDetail", param).then((res) => {
        this.detailTutorLecture = res.data.detailTutorLecture;
        this.detailTutorLecture.start_date = this.formatDate(
          this.detailTutorLecture.start_date
        );
        this.detailTutorLecture.end_date = this.formatDate(
          this.detailTutorLecture.end_date
        );
      });
    },
  },
  mounted() {
    this.detailModalProps ? this.getLectureDetail() : null;
  },
};
</script>

<style>
@import "../lectureStudentInfo/LectureModal.css";
</style>
