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
  
      <span class="conTitle mt50">학생 목록</span>
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
          <a class="btn btn-light" @click="searchStudentDate(paramObj)">
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
          <td  @click="modalHandler(stu.std_num, stu.loginID)">
          {{ stu.name }}({{ stu.loginID }})
          </td>
          <td>{{ stu.tel }}</td>
          <td>{{ stu.join_date }}</td>
          <td></td>
        </tr>
      </table>
      <DetailStudent 
      v-if="modalBoolean" @closeModal="modalBoolean= $event" 
        :std_num="std_num"
        :loginID="loginID"
        @closeAndSearch="modalClose"
        :data="dataList"
      />  
    </div>
    <!-- <Pagination v-bind="{ currentPage_std, totalCnt_std: stutotal, itemsPerPage: 5 }" @search="searchLecture($event)" /> -->
  </template>
  
  <script setup>
  import { ref, onMounted, provide } from 'vue';
  import Pagination from '@/components/common/PaginationComponent.vue';
  import { LecList, SamplePage7 } from '@/api/api';
  import { axiosAction } from '.'; 
  import DetailStudent from './DetailStudent.vue';

//강의를 출력하기 위한 변수
  const dataList = ref([]);
  const total = ref(0);
  const currentPage = ref(1);
  const searchWord_lec =ref([]);

//데이터를 deepchild까지 전달하기 위함
provide ('dataList', dataList);

//학생 정보를 출력하기 위한 변수
  const studata = ref([]);
  const stutotal = ref(0);
  const searchKeyStd = ref('');
  const searchWordStd = ref('');
  const paramObj = ref({ from_date: '', to_date: '' });

//팝업 창을 만들기 위한 변수
  const modalBoolean = ref(false);
  const std_num =ref(0);
  const loginID =ref(0);
  

//강의 리스트 출력을 위한 메소드 
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
  
  

  const searchStu = async (lec_id = null, cpage = 1) => {
    console.log('lec_id:', lec_id);
  console.log('currentPage_std:', cpage);
  console.log('from_date:', paramObj.value.from_date);
  console.log('to_date:', paramObj.value.to_date);
  let param = new URLSearchParams();
  if (lec_id !== null) {
    param.append('lec_id', lec_id);
  }
  param.append('currentPage_std', cpage);
  param.append('pageSize_std', 5);
  param.append('searchKey_std', searchKeyStd.value);
  param.append('searchWord_std', searchWordStd.value);
  param.append('totalCnt_std', '');
  param.append('from_date', paramObj.value.from_date); // corrected from 'from_data'
  param.append('to_date', paramObj.value.to_date);

  const stulist = await axiosAction(LecList.std_list, param);

  if (stulist) {
    console.log('학생정보:', stulist.list_std);
    console.log('총 개수:', stulist.totalCnt_std);
    studata.value = stulist.list_std;
    stutotal.value = stulist.totalCnt_std;
  }
};

// 학생 리스트 날짜 검색 기능
const searchStudentDate = () => {
  searchStu(null);
};

//전체 강의 출력  
  const allLecture = () => {
  searchWord_lec.value = '';
  searchLecture(1);
};

//강의리스트 검색 기능 
  const searchData = () => {
    searchLecture(1);
  };

//학생 리스트 전체 조회
  const allStu = async () => {
  searchStu('', 1);
};

//학생 리스트 검색 기능 
const searchStudent = () => {
  searchStu(1);
};



//팝업창 제어 기능 
const modalHandler = (paramNum, paramId) => {
  console.log('열려라 참깨~~~~~~!!!!!!!');
  modalBoolean.value = true;
  std_num.value = paramNum;
  loginID.value = paramId;
  
  console.log('std_num:', paramNum, 'loginID:', loginID.value);
};

//팝업창 닫기
const modalClose = (param) => {
    modalBoolean.value = param;
    searchStu();
  };

//훅
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
  