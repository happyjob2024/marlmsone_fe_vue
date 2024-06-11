<template>
  <div>
    <p class="Location">
      <span class="btn_nav bold">학습관리</span>
      <span class="btn_nav bold">과제관리</span>
    </p>
    <p class="conTitle">
      <span class="conNm">강의 목록</span>
      <span>
        <span>강의명 </span>
        <select
          id="searchKey"
          v-model="lectureValue"
          style="width: 150px; margin: 0 5px 5px 0"
        >
          <option
            v-for="lec in lectureList"
            :key="lec.lec_id"
            :value="lec.lec_id"
          >
            {{ lec.lec_name }}
          </option>
        </select>
        <button
          class="btn btn-primary mx-2"
          @click="[getLectureDetailList(), getProjectList()]"
        >
          검색
        </button>
        <button class="btn btn-primary mx-2" @click="uploadModalHandler()">
          과제 올리기
        </button>
      </span>
    </p>

    <div class="lectureInfoTitle"><h2>수업정보</h2></div>
    <div class="divMatList">
      <div style="float: left"></div>
      <table class="col" style="margin-bottom: 10px">
        <colgroup>
          <col width="25%" />
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
          <col width="15%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr style="border: 0px; border-color: blue">
            <th scope="col">강의명</th>
            <th scope="col">강사명</th>
            <th scope="col">개강일</th>
            <th scope="col">종강일</th>
            <th scope="col">강의실</th>
            <th scope="col">현재인원</th>
            <th scope="col">정원</th>
          </tr>
        </thead>
        <tbody id="projectLectureDettail">
          <template v-if="Object.entries(lectureDetailList).length > 0">
            <tr>
              <td>{{ lectureDetailList.lec_name }}</td>
              <td>{{ lectureDetailList.tutor_name }}</td>
              <td>{{ formatDate(lectureDetailList.start_date) }}</td>
              <td>{{ formatDate(lectureDetailList.end_date) }}</td>
              <td>{{ lectureDetailList.lecrm_name }}</td>
              <td>{{ lectureDetailList.pre_pnum }}</td>
              <td>{{ lectureDetailList.max_pnum }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="7">강의명을 선택해주세요.</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="lectureInfoTitle"><h2>과제 정보</h2></div>
    <div class="divMatList">
      <table class="col" style="margin-bottom: 10px">
        <colgroup>
          <col width="10%" />
          <col width="55%" />
          <col width="10%" />
          <col width="10%" />
          <col width="15%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">과제 번호</th>
            <th scope="col">과제 이름</th>
            <th scope="col">제출일</th>
            <th scope="col">마감일</th>
            <th scope="col">제출현황</th>
          </tr>
        </thead>
        <tbody id="projectList">
          <template v-if="tutorProjectList.length > 0">
            <tr v-for="list in tutorProjectList" :key="list.lectureId">
              <td>{{ list.projectId }}</td>
              <td>
                <a
                  class="pointer"
                  style="text-decoration: none; color: blue"
                  @click="detailModalHandler(list.projectId)"
                  >{{ list.projectTitle }}</a
                >
              </td>
              <td>{{ formatDate(list.startDate) }}</td>
              <td>{{ formatDate(list.deadLineDate) }}</td>
              <td>
                <a
                  class="pointer"
                  style="text-decoration: none; color: blue"
                  @click="submitModalHandler(list.projectId)"
                  >자세히 보기</a
                >
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">데이터가 존재하지 않습니다.</td>
            </tr>
          </template>
        </tbody>
      </table>
      <Pagination
        :currentPage="currentPage"
        :totalItems="totalItems"
        @search="getProjectList($event)"
        v-if="totalItems > 0"
      />
    </div>
    <TestUploadModal
      v-if="uploadModalState"
      @closeModal="uploadModalState = false"
      @closeAndreload="closeAndreload"
      :uploadModalProps="uploadModalProps"
      :currentPage="currentPage"
    />
    <TestDetailModal
      v-if="detailModalState"
      @closeModal="detailModalState = false"
      @closeAndreload="closeAndreload"
      :detailModalProps="detailModalProps"
      :currentPage="currentPage"
    />
    <TestSubmitModal
      v-if="submitModalState"
      @closeModal="submitModalState = false"
      :submitModalProps="submitModalProps"
    />
  </div>
</template>

<script>
import Pagination from "@/components/common/PaginationComponent.vue";
import TestUploadModal from "./TestUploadModal.vue";
import TestDetailModal from "./TestDetailModal.vue";
import TestSubmitModal from "./TestSubmitModal.vue";
import axios from "axios";

export default {
  data() {
    return {
      lectureList: [],
      tutorProjectList: [],
      lectureDetailList: {},
      currentPage: 0,
      totalItems: 0,
      detailModalState: false,
      uploadModalState: false,
      submitModalState: false,
      detailModalProps: 0,
      uploadModalProps: 0,
      submitModalProps: 0,
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

    saveAlert() {
      alert("강의명을 선택해주세요");
    },

    // 강의 리스트
    getLectureList() {
      axios.get("/tut/projectLectureListjson").then((res) => {
        this.lectureList = res.data.lectureList;
        this.lectureValue = res.data.lectureList[0].lec_id;
      });
    },

    // 강의 상세 리스트
    getLectureDetailList() {
      let param = new URLSearchParams();

      param.append("tutorId", sessionStorage.getItem("loginId"));
      param.append("lectureId", this.lectureValue);
      axios.post("/tut/projectLectureDetail", param).then((res) => {
        this.lectureDetailList = res.data.detailTutorLecture;
        //console.log(this.lectureDetailList);
        //console.log(this.lectureDetailList.length);
        //console.log(this.lectureValue);
      });
    },

    // 과제 리스트
    getProjectList(currentPage) {
      currentPage = currentPage || 1;

      let param = new URLSearchParams();
      param.append("tutorId", sessionStorage.getItem("loginId"));
      param.append("lectureId", this.lectureValue);
      param.append("currentPage", currentPage);
      param.append("pageSize", 10);
      axios.post("/tut/tutorProjectListjson", param).then((res) => {
        this.tutorProjectList = res.data.tutorProjectList;
        this.currentPage = currentPage;
        this.totalItems = res.data.totalCount;
      });
    },
    closeAndreload() {
      this.uploadModalState = false;
      this.detailModalState = false;
      this.getProjectList();
    },

    uploadModalHandler() {
      this.uploadModalState = true;
      this.uploadModalProps = this.lectureValue;
    },
    detailModalHandler(projectId) {
      this.detailModalState = true;
      this.detailModalProps = projectId;
    },
    submitModalHandler(projectId) {
      this.submitModalState = true;
      this.submitModalProps = projectId;
    },
  },
  mounted() {
    this.getLectureList();
    // this.lectureValue
    //   ? [this.getLectureDetailList(), this.getProjectList()]
    //   : null;
  },
  components: { Pagination, TestUploadModal, TestDetailModal, TestSubmitModal },
};
</script>

<style>
a.pointer {
  cursor: pointer;
}

.lectureInfoTitle {
  margin: 25px 0 15px 0;
}

.lectureInfoTitle > h2 {
  font-size: 20px;
  font-weight: bold;
}
</style>
