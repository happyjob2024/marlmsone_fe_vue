<template>
  <div id="notice">
    <p class="Location">
     <span class="btn_nav bold">학습관리</span>
              <span class="btn_nav bold">강의목록 </span>
    </p>
    <p class="conTitle">
      <span>강의목록</span>
      
                <span style="font-size: large">검색 조건을 입력하세요</span>
                <span class="search">
                <select class="form-select"  v-model="paramObj.searchKey">
                  <option value="all" >전체</option>
                  <option value="lec_name" id="lec_name">강의명</option>
                  <option value="t_name" id="t_name">강사명</option>
              </select>
                <input
                  type="text"
                  style="width: 200px;"
                  class="form-control"
                  v-model="paramObj.searchInfo"
                />
              </span>
                <span>
                  <a class="btn btn-primary" @click="getRegisterList()">
                    <span>검 색</span>
                  </a>
                  <a class="btn btn-primary mx-1" @click="modalHandler()">
                    <span>신규등록</span>
                  </a>
                </span>
             
    </p>

    <div class="divComGrpCodList">
      <div style="float: left">
        <b> 총건수 : 0 현재 페이지 번호 : 0 </b>
      </div>
      <table class="col">
        <caption></caption>
        <colgroup>
          <col width="10%" />
          <col width="30%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">강의번호</th>
            <th scope="col">강의명</th>
            <th scope="col">담당교수</th>
            <th scope="col">강의실</th>
            <th scope="col">수강인원</th>
            <th scope="col">기간</th>
            <th scope="col">수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="registerList.length > 0">
            <tr v-for="(list, i) in registerList" :key="i">
              <td>{{ list.lec_id }}</td>
              <!-- <td @click="getStdList(list.lec_id) "> -->
              <td @click="getStdList(list.lec_id) ">
                {{ list.lec_name }}
              </td>
              <td>{{ list.t_name }}</td>
              <td>{{ list.lecrm_name }}</td>
              <td>{{ list.pre_pnum }}</td>
              <td>{{ list.start_date }} ~ {{ list.end_date }}</td>
              <td>
                <button
                type="button"
                class="btn btn-info"
                @click="modalHandler(list.lec_id)"
                style="margin-right: 5px;"
              >
                수정
              </button>
              <button
                type="button"
                class="btn btn-info"
                @click="delRegister(list.lec_id)"
              >
                삭제
              </button>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="7">일치하는 검색 결과가 없습니다</td>
            </tr>
          </template>
        </tbody>
      </table>
      <Pagination
        :currentPage="currentPage"
        :totalItems="totalItems"
        @search="getRegisterList($event)"
        v-if="totalItems > 0"
      />
    </div>
    <!-- 모달있던 자리 -->

  </div><br>
  <table class="col" v-show="isVisible">
        <caption></caption>
        <colgroup>
          <col width="30%" />
          <col width="30%" />
          <col width="30%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">학번</th>
            <th scope="col">학생명</th>
            <th scope="col">과정명</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="studentList.length > 0">
            <tr v-for="(list, i) in studentList" :key="i">
              <td>{{ list.std_num }}</td>
              <td>{{ list.name }}</td>
              <td>{{ list.lec_name }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="3">일치하는 검색 결과가 없습니다</td>
            </tr>
          </template>
        </tbody>
        <Pagination
          :currentPage="currentPage"
          :totalStudent="totalStudent"
          @search="getStdList(id, $event)"
          v-if="totalStudent.length > 0"
        />
      </table>
      <RegisterModal
      v-if="modalState"
      @closeModal="modalState = false"
      :getRegisterList="getRegisterList"
      :modalProps="modalProps"
      :currentPage="currentPage"
    />
</template>

<script>
import axios from "axios";
import Pagination from "@/components/common/PaginationComponent.vue";
import NoticeModal from "@/views/system/notice/NoticeModal.vue";
import RegisterModal from '../registerList/RegisterModal.vue';

export default {
  data() {
    return {
      registerList: [],
      paramObj: { searchInfo: "", searchKey: "all", all: "all", lec_name: "lec_name", t_name: "t_name"},
      currentPage: 0,
      totalItems: 0,
      studentList: [],
      totalStudent: 0,
      isVisible: false,
      modalState: false,
      modalProps: 0,
      lecrmList: [],
      tutList: [],
      typeList: [],
    };
  },
  methods: {
    getRegisterList(cpage) {
      cpage = cpage || 1;
      let param = new URLSearchParams(this.paramObj);
      param.append("currentPage", cpage);
      param.append("pageSize", 10);

      axios.post("/register/listLecjson.do", param).then((res) => {
        this.registerList = res.data.lec_List;
        this.currentPage = cpage;
        this.totalItems = res.data.lec_Total;
      });

      axios.post("/register/registerListControljson.do", param).then((res) => {
        this.lecrmList = res.data.lecrmList;
        this.tutList = res.data.tutList;
        this.typeList = res.data.typeList;
      });
      
    },

 
    getStdList(lec_id, cpage){
      cpage = cpage || 1;
      let param = new URLSearchParams();
      param.append("lec_id", lec_id); 
      param.append("currentPage", cpage);
      param.append("pageSize", 10);

      axios.post("/register/stdListjson.do", param).then((res) => {
        this.studentList = res.data.stdList;
        this.currentPage = cpage;
        this.totalStudent = res.data.std_Total;

        this.isVisible = true
      });

    },



    delRegister(lec_id) {
      let param = new URLSearchParams();
      param.append("lec_id", lec_id);

      axios.post("/register/delRegister.do", param).then((res) => {
        if (res.data.result) {
          alert(res.data.resultMsg);
          this.getRegisterList();
        }
      });
    },

    modalHandler(lecId) {
      this.modalState = true;
      this.modalProps = lecId

    },
  },
  mounted() {
    this.getRegisterList();
    console.log('서치키 ',this.paramObj.searchKey)
  },
  components: { Pagination, NoticeModal, RegisterModal },
};
</script>

<style>
</style>
