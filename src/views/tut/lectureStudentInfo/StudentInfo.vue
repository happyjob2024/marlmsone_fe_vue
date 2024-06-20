<template>
  <div>
    <p class="conTitle">
      <span class="conNm">수강생 목록</span>
      <span>
        <span>강의명 </span>
        <input
          type="text"
          id="search"
          style="width: 150px; height: 30px; margin: 0 5px 5px 0"
          placeholder="검색조건을 입력하세요"
        />
        <button class="btn btn-primary mx-2" @click="getSearchLearnMatList()">
          검색
        </button>
      </span>
    </p>
    <div>
      <div id="listCount" style="margin-bottom: 10px">
        <b>
          총건수 : {{ totalItems }} , 현재 페이지 번호 : {{ currentPage }}
        </b>
      </div>
    </div>
    <div class="divComGrpCodList">
      <div style="float: left"></div>
      <table class="col" style="margin-bottom: 10px">
        <colgroup>
          <col width="15%" />
          <col width="15%" />
          <col width="20%" />
          <col width="20%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>

        <thead>
          <tr style="border: 0px; border-color: blue">
            <th scope="col">학번</th>
            <th scope="col">학생 명(ID)</th>
            <th scope="col">휴대전화</th>
            <th scope="col">가입일자</th>
            <th scope="col">승인여부</th>
            <th scope="col">강의 승인</th>
          </tr>
        </thead>
        <tbody id="studentList">
          <template v-if="studentList.length > 0">
            <tr v-for="list in studentList" :key="list.lec_id">
              <td>{{ list.student_number }}</td>
              <td>
                <a
                  class="pointer"
                  @click="detailModalHandler(list.student_name)"
                  >{{ list.lec_name }}</a
                >
              </td>
              <td>{{ list.student_tel }}</td>
              <td>
                {{ formatDate(list.join_date) }}
              </td>
              <td>{{ list.join_date }}</td>
              <td>{{ list.approve_yn }}</td>
              <td><button class="btn btn-primary mx-2">승인</button></td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="4">데이터가 존재하지 않습니다.</td>
            </tr>
          </template>
        </tbody>
      </table>
      <Pagination
        v-bind="{ currentPage, totalItems, itemsPerPage: pageSize }"
        @search="getSearchLectureList($event)"
        v-if="totalItems > 0"
      />
    </div>
    <StudentModal
      v-if="detailModalState"
      @closeModal="detailModalState = false"
      @closeAndreload="closeAndreload"
      v-bind="{ detailModalProps }"
    />
  </div>
</template>

<script>
import Pagination from "@/components/common/PaginationComponent.vue";
import StudentModal from "./StudentModal.vue";
import axios from "axios";

export default {
  props: ["lectureValue"],
  data() {
    return {
      searchList: [],
      currentPage: 0,
      totalItems: 0,
      detailModalState: false,
      detailModalProps: 0,
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

    getSearchStudentList(currentPage) {
      currentPage = currentPage || 1;
      let pageSize = 5;

      let param = new URLSearchParams();
      param.append("tutorId", sessionStorage.getItem("loginId"));
      param.append("lectureValue", this.searchtitle);
      param.append("currentPage", currentPage);
      param.append("pageSize", pageSize);
      axios.post("/tut/LectureStudentListjson", param).then((res) => {
        this.studentList = res.data.lectureStudentList;
        this.pageSize = pageSize;
        this.currentPage = currentPage;
        this.totalItems = res.data.totalCount;
      });
    },

    closeAndreload() {
      this.detailModalState = false;
      this.getSearchStudentList();
    },

    detailModalHandler(learnDataId) {
      this.detailModalState = true;
      this.detailModalProps = learnDataId;
    },
  },

  mounted() {
    this.getSearchStudentList();
  },

  components: { Pagination, StudentModal },
};
</script>

<style></style>
