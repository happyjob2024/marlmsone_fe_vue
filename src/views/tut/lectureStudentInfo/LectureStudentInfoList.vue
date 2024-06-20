<template>
  <div>
    <p class="Location">
      <span class="btn_nav bold">학습관리</span>
      <span class="btn_nav bold">수강생 정보</span>
    </p>
    <p class="conTitle">
      <span class="conNm">강의 목록</span>
      <span>
        <span>과정명 </span>
        <input
          type="text"
          id="search"
          style="width: 160px; height: 30px; margin: 0 5px 5px 0"
          placeholder="검색조건을 입력해주세요"
          v-model="searchLecWord"
        />
        <button
          class="btn btn-primary mx-2"
          @click="[getSearchLectureList(), (isClickedOption = false)]"
        >
          검색
        </button>
      </span>
    </p>
    <div>
      <div id="listCount" style="margin-bottom: 10px">
        <b>
          총건수 : {{ lectureTotalItems }} , 현재 페이지 번호 :
          {{ lectureCurrentPage }}
        </b>
      </div>
    </div>
    <div class="divComGrpCodList">
      <div style="float: left"></div>
      <table class="col" style="margin-bottom: 10px">
        <colgroup>
          <col width="10%" />
          <col width="45%" />
          <col width="30%" />
          <col width="15%" />
        </colgroup>

        <thead>
          <tr style="border: 0px; border-color: blue">
            <th scope="col">과정ID</th>
            <th scope="col">과정명</th>
            <th scope="col">기간</th>
            <th scope="col">수강생 보기</th>
          </tr>
        </thead>
        <tbody id="listMat">
          <template v-if="searchList.length > 0">
            <tr v-for="list in searchList" :key="list.lec_id">
              <td id="lv">{{ list.lec_id }}</td>
              <td>
                <a class="pointer" @click="detailModalHandler(list.lec_id)">{{
                  list.lec_name
                }}</a>
              </td>
              <td>
                {{ formatDate(list.start_date) }} ~
                {{ formatDate(list.end_date) }}
              </td>
              <td>
                <button
                  id="select"
                  class="btn btn-primary mx-2 tablebtn"
                  @click="getSearchStudentList(1, list.lec_id)"
                >
                  조회
                </button>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="4">강의가 존재하지 않습니다.</td>
            </tr>
          </template>
        </tbody>
      </table>
      <Pagination
        v-bind="{
          currentPage: lectureCurrentPage,
          totalItems: lectureTotalItems,
          itemsPerPage: pageSize_LL,
        }"
        @search="getSearchLectureList($event)"
        v-if="lectureTotalItems > 0"
        style="margin-top: 20px"
      />
    </div>
    <LectureModal
      v-if="detailModalState"
      @closeModal="detailModalState = false"
      @closeAndreload="closeAndreload"
      v-bind="{ detailModalProps }"
    />
  </div>
  <div v-if="isClickedOption" style="margin-top: 20px">
    <p class="conTitle">
      <span class="conNm">수강생 목록</span>
      <span>
        <select
          id="searchKey"
          v-model="selected"
          style="width: 100px; margin: 0 5px 5px 0"
        >
          <option
            v-for="option in selectOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
        <input
          v-if="(isSelectOption = selected != 'all' ? true : false)"
          type="text"
          id="studentValue"
          style="width: 160px; height: 30px; margin: 0 5px 5px 0"
          placeholder="검색조건을 입력해주세요"
          v-model="searchStuWord"
        />
        <button
          class="btn btn-primary mx-2"
          @click="getSearchStudentList(1, this.lectureValue)"
        >
          검색
        </button>
      </span>
    </p>
    <div>
      <div id="listCount" style="margin-bottom: 10px">
        <b>
          총건수 : {{ studentTotalItems }} , 현재 페이지 번호 :
          {{ studentCurrentPage }}
        </b>
      </div>
    </div>
    <div class="divComGrpCodList">
      <div style="float: left"></div>
      <table class="col" style="margin-bottom: 10px">
        <colgroup>
          <col width="10%" />
          <col width="20%" />
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
            <tr v-for="list in studentList" :key="list.lec_Id">
              <td>{{ list.student_number }}</td>
              <td>
                <a class="pointer" @click="studentModalHandler(list.std_id)"
                  >{{ list.student_name }} ({{ list.std_id }})</a
                >
              </td>
              <td>{{ list.student_tel }}</td>
              <td>
                {{ formatDate(list.join_date) }}
              </td>
              <td>{{ list.approve_yn }}</td>
              <td>
                <template v-if="list.approve_yn === 'N'">
                  <button
                    class="btn btn-primary mx-2 tablebtn"
                    @click="lectureApprove(list.std_id, list.lec_Id)"
                  >
                    승인
                  </button>
                </template>
                <template v-else>
                  <button
                    class="btn btn-primary mx-2 gray tablebtn"
                    @click="lectureCancel(list.std_id, list.lec_Id)"
                  >
                    취소
                  </button>
                </template>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="6">수강생이 존재하지 않습니다.</td>
            </tr>
          </template>
        </tbody>
      </table>
      <Pagination
        v-bind="{
          currentPage: studentCurrentPage,
          totalItems: studentTotalItems,
          itemsPerPage: pageSize_SL,
        }"
        @search="getSearchStudentList($event)"
        v-if="studentTotalItems > 0"
        style="margin-top: 20px"
      />
    </div>
    <StudentModal
      v-if="studentModalState"
      @closeModal="studentModalState = false"
      @closeAndreload="closeAndreload"
      v-bind="{ studentModalProps }"
    />
  </div>
</template>

<script>
import Pagination from "@/components/common/PaginationComponent.vue";
import LectureModal from "./LectureModal.vue";
import StudentModal from "./StudentModal.vue";
import axios from "axios";

export default {
  data() {
    return {
      searchList: [],
      studentList: [],
      searchLecWord: "",
      searchStuWord: "",
      selected: "all",
      selectOptions: [
        { text: "전체", value: "all" },
        { text: "이름", value: "studentName" },
        { text: "아이디", value: "studentId" },
        { text: "전화번호", value: "studentTel" },
      ],
      lectureCurrentPage: 0,
      studentCurrentPage: 0,
      lectureTotalItems: 0,
      studentTotalItems: 0,
      detailModalState: false,
      studentModalState: false,
      isClickedOption: false,
      isSelectOption: false,
      detailModalProps: 0,
      studentModalProps: 0,
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

    getSearchLectureList(currentPage) {
      currentPage = currentPage || 1;
      let pageSize = 5;

      let param = new URLSearchParams();
      param.append("tutorId", sessionStorage.getItem("loginId"));
      param.append("lectureValue", this.searchLecWord);
      param.append("currentPage", currentPage);
      param.append("pageSize", pageSize);
      axios.post("/tut/tutorLectureListjson", param).then((res) => {
        this.searchList = res.data.lectureList;
        console.log(this.searchList);
        this.pageSize_LL = pageSize;
        this.lectureCurrentPage = currentPage;
        this.lectureTotalItems = res.data.totalCount;
      });
    },

    getSearchStudentList(currentPage, lectureValue) {
      this.isClickedOption = true;
      currentPage = currentPage || 1;
      let pageSize = 3;

      let param = new URLSearchParams();
      param.append("tutorId", sessionStorage.getItem("loginId"));
      param.append("lectureValue", lectureValue);
      param.append("currentPage", currentPage);
      param.append("pageSize", pageSize);
      param.append("searchKey", this.selected);
      param.append("studentValue", this.searchStuWord);
      axios.post("/tut/LectureStudentListjson", param).then((res) => {
        this.studentList = res.data.lectureStudentList;
        this.lectureValue = res.data.lectureStudentList[0].lec_Id;
        this.pageSize_SL = pageSize;
        this.studentCurrentPage = currentPage;
        this.studentTotalItems = res.data.totalCount;
      });
    },

    // 수강 승인
    lectureApprove(stdId, lecId) {
      if (confirm("수강을 승인하시겠습니까?") == true) {
        let param = new URLSearchParams();
        param.append("studentId", stdId);
        param.append("lectureId", lecId);
        axios.post("/tut/lectureStudentApprove", param).then((res) => {
          if (res.data === true) {
            alert("수강이 완료되었습니다.");
            this.getSearchStudentList(1, lecId);
          }
        });
      }
    },

    // 수강 승인 취소
    lectureCancel(stdId, lecId) {
      if (confirm("수강을 취소하시겠습니까?") == true) {
        let param = new URLSearchParams();
        param.append("studentId", stdId);
        param.append("lectureId", lecId);
        axios.post("/tut/lectureStudentCancle", param).then((res) => {
          if (res.data === true) {
            alert("수강이 취소되었습니다.");
            this.getSearchStudentList(1, lecId);
          }
        });
      }
    },

    closeAndreload() {
      this.detailModalState = false;
      this.getSearchLectureList();
    },

    detailModalHandler(learnDataId) {
      this.detailModalState = true;
      this.detailModalProps = learnDataId;
    },

    studentModalHandler(stcId) {
      this.studentModalState = true;
      this.studentModalProps = stcId;
    },
  },

  mounted() {
    this.getSearchLectureList();
  },

  components: { Pagination, LectureModal, StudentModal },
};
</script>

<style>
.tablebtn {
  width: 100px;
  background-color: #24b5ea;
  border-color: #24b5ea;
}

.gray {
  background-color: gray;
  border-color: gray;
}

.gray:hover {
  background-color: #1e1e1e;
  border-color: #1e1e1e;
}
</style>
