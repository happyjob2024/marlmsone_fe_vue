<template>
    <div class="divComGrpCodList">
      <p class="Location">
        <span class="btn_nav bold">인원 관리</span>
        <span class="btn_nav bold">학생 관리</span>
      </p>
      <p class="conTitle">
        <span class="conNm">강의 리스트</span>
        <span class="fr">
          <span>강의명</span>
          <input type="text" class="lecure-name" v-model="searchWord_lec" />
          <button class="btn btn-light btn-sm" @click="allLecture">전체 검색</button>
          <button class="btn btn-secondary btn-sm" @click="searchData">검색</button>
        </span>
      </p>
      <div>
        <b> 총 원 : {{ total }} 현재 페이지 번호 : {{ currentPage }} </b>
      </div>
      <div class="row">
        <table class="col">
          <tr>
            <td>과정 ID</td>
            <td>과정명</td>
            <td>기간</td>
          </tr>
          <tr v-for="(lecture, i) in dataList" :key="i">
            <td>{{ lecture.lec_id }}</td>
            <td @click="searchStu(lecture.lec_id)">{{ lecture.lec_name }}</td>
            <td>{{ lecture.start_date }} ~ {{ lecture.end_date }}</td>
          </tr>
        </table>
      </div>
      <Pagination v-bind="{ currentPage, totalItems: total, itemsPerPage: 6 }" @search="searchLecture($event)" />
  
      <span class="conNm">학생 목록</span>
      <select v-model="searchKeyStd">
        <option value="all">전체</option>
        <option value="stdNm">학생명</option>
        <option value="stdId">ID</option>
        <option value="tel">전화번호</option>
      </select>
      <input type="text" v-model="searchWordStd" />
      <button class="btn btn-light" @click="searchStudent()">검색</button>
  
      <button @click="allStu" class="btn btn-light">전체 학생</button>
      <button @click="getDapv" class="btn btn-light">미수강 학생</button>
  
      <div class="date-picker">
        <label for="from_date">가입일 조회</label>
        <input type="date" style="width: 15%" class="form-control" v-model="paramObj.from_date" />
        ~
        <input type="date" style="width: 15%" class="form-control" v-model="paramObj.to_date" />
        <span class="fr">
          <a class="btn btn-light" @click="searchStudentDate()">
            <span>검색</span>
          </a>
        </span>
      </div>
      <table class="col">
        <tr>
          <td>학번</td>
          <td>수강강의</td>
          <td>학생 명(ID)</td>
          <td>휴대전화</td>
          <td>가입일자</td>
          <td></td>
        </tr>
        <tr v-for="(stu, i) in studata" :key="i">
          <td>{{ stu.std_num }}</td>
          <td>{{ stu.lec_name }}</td>
          <td>{{ stu.name }}({{ stu.loginID }})</td>
          <td>{{ stu.tel }}</td>
          <td>{{ stu.join_date }}</td>
          <td></td>
        </tr>
      </table>
    </div>
    <!-- <Pagination v-bind="{ currentPage_std, totalCnt_std: stutotal, itemsPerPage: 5 }" @search="searchLecture($event)" /> -->
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Pagination from '@/components/common/PaginationComponent.vue';
  import { LecList } from '@/api/api';
  import { axiosAction } from '.'; // 경로를 적절히 수정해야 할 수 있습니다.
  
  const dataList = ref([]);
  const total = ref(0);
  const currentPage = ref(1);
  const searchWord_lec =ref([]);

  const studata = ref([]);
  const stutotal = ref(0);
  const searchKeyStd = ref('');
  const searchWordStd = ref('');
  const paramObj = ref({ from_date: '', to_date: '' });
 

  const searchLecture = async (cpage = 1) => {
    let param = new URLSearchParams();
    param.append('searchWord_lec',searchWord_lec.value);
    param.append('currentPage', cpage);
    param.append('pageSize', 6);
  
    const lecList = await axiosAction(LecList.lec_list, param);
  
    if (lecList) {
      dataList.value = lecList.list_lec;
      total.value = lecList.totalCnt_lec;
      currentPage.value = cpage;
  
      console.log('리스트 데이터:', lecList.list_lec);
      console.log('총 개수:', lecList.totalCnt_lec);
      console.log('현재 페이지:', cpage);
    }
  };
  
  const searchStu = async (lec_id, cpage = 1) => {
    let param = new URLSearchParams();
    param.append('lec_id', lec_id);
    param.append('currentPage_std', cpage);
    param.append('pageSize_std', 5);
    param.append('searchKey_std', searchKeyStd.value);
    param.append('searchWord_std', searchWordStd.value);
    param.append('totalCnt_std','');
    param.append('from_data', paramObj.value);
    param.append('to_date', paramObj.value);
    const stulist = await axiosAction(LecList.std_list, param);
  
    if (stulist) {
      console.log('학생정보:', stulist.list_std);
      console.log('총 개수:', stulist.totalCnt_std);
      studata.value = stulist.list_std;
      stutotal.value = stulist.totalCnt_std;
    }
  };
  const allLecture = () => {
  searchWord_lec.value = '';
  searchLecture(1);
};
  const searchData = () => {
    searchLecture(1);
  };
  
  const allStu = async () => {
  searchStu('', 1);
};
const searchStudent = () => {
  searchStu(1);
}
const searchStudentDate = (data) => {
  searchStu(data);
}
  onMounted(() => {
    searchLecture();
    searchStu();
    allLecture();
    allStu();
    searchData();
  });
  </script>
  
  <style>

.lecure-name {
  height: 30px;
  border-radius: 5px;
}

.btn-sm {
  margin-left: 10px;
}

</style>
  