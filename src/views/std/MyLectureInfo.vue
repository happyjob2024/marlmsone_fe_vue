<template>
  <div id="notice">
      <p class="Location">
          <a href="/dashboard/home" class="btn_set home"></a>
          <span class="btn_nav bold">학습관리</span>
          <span class="btn_nav bold">나의 수강목록</span>
      </p>
      <p class="conTitle">
          <span>나의 수강목록</span>
          <span>
              <select v-model="searchKey">
                  <option value="AllLec" selected="selected">전체 수강목록</option>
                  <option value="ProceedingLec">진행중인 수강목록</option>
                  <option value="LastLec">지난 수강목록</option>
              </select>
          </span>
      </p>
      <div class="divComGrpCodList">
            <table class="col">
                <caption></caption>
                <colgroup>
                    <col width="10%" />
                    <col width="20%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="30%" />
                    <col width="10%" />
                    <col width="10%" />
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">강의번호</th>
                        <th scope="col">강의명</th>
                        <th scope="col">강사명</th>
                        <th scope="col">강의실</th>
                        <th scope="col">기간</th>
                        <th scope="col">승인여부</th>
                        <th scope="col">설문조사여부</th>
                    </tr>
                </thead>
                <tbody>
                  <template v-if="dataList && dataList.length > 0">
                    <tr v-for="data in dataList" :key="data.lec_id">
                      <td>{{ data.lec_id }}</td>
                      <td @click="modalHandler(data.lec_id)">{{ data.lec_name }}</td>
                      <td>{{ data.tut_name }}</td>
                      <td>{{ data.lecrm_name }}</td>
                      <td>
                        {{ data.start_date }} ~ {{ data.end_date }}
                        <span v-if="data.apv_yn === 'Y' && lectureOnGoing(data) && lectureStopGoing(data)"> (진행중)</span>
                      </td>
                      <td>{{ data.apv_yn === 'Y' ? '승인' : '미승인' }}</td>
                      <td>{{ lectureStopGoing(data) ? '응시기간 아님' : '진행중' }}</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="7">일치하는 검색 결과가 없습니다</td>
                    </tr>
                  </template>
                </tbody>
            </table>
        </div>
        <Pagination 
          v-bind="{ currentPage, totalItems: listCount, itemsPerPage: 5 }"
          @search="searchMyLectureInfo($event)"
          v-if="dataList.length > 0"
        />
        <ModalLecture 
          v-if="modalBoolean" 
          :lecture_id="lecture_id"
          @closeModal="modalBoolean = $event"
        />
  </div>
</template>

<script setup>
import Pagination from '@/components/common/PaginationComponent.vue';
import ModalLecture from './ModalLecture.vue';
import axios from 'axios';
import {  onMounted, ref, watch } from 'vue';

  const dataList = ref([]);
  const listCount = ref(0);
  const currentPage = ref(1);
  const currentTime = ref(new Date());
  const searchKey = ref('AllLec');
  const modalBoolean = ref(false);
  const lecture_id = ref(0);

  const searchMyLectureInfo = (page) => {
    page = page || 1;
    let param = new URLSearchParams();
    param.append('currentPage', page);
    param.append('pageSize', 5);
    param.append('searchKey', searchKey.value);

    axios.post('/std/myLectureList.do', param).then((res) => {
      dataList.value = res.data.listData;
      listCount.value = res.data.listCnt;
      currentPage.value = page;
    });
  };

  const lectureOnGoing = (data) => {
    const startDate = new Date(data.start_date);
    return currentTime.value >= startDate; // 현재 날짜가 시작날짜보다 크다면
  };

  const lectureStopGoing = (data) => {
    const endDate = new Date(data.end_date);
    return currentTime.value <= endDate; // 현재 날짜가 종료날짜보다 적다면
  }

  const modalHandler = (param) => {
    modalBoolean.value = true;
    lecture_id.value = param;
  };

  watch(searchKey, () => {
    searchMyLectureInfo();
  });

  onMounted(() => {
    searchMyLectureInfo();
  });

</script>

<style>

</style>