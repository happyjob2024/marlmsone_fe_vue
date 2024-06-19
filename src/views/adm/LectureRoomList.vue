<template>
  <div class="content">
    <p class="Location">
      <a class="btn_set home">메인으로</a> 
      <span class="btn_nav bold">시설 관리</span> 
      <span class="btn_nav bold"> 강의실</span>
      <a class="btn_set refresh">새로고침</a>
    </p>
    <div>
      <p class="conTitle">
        <span>강의실</span> 
        <span class="fr">
          <span>강의실 명 </span>
          <input type="text" class="lecure-name" v-model="searchRoomName">
          <button class="btn btn-primary mx-1" @click="getLectureList()">검색</button>
          <button class="btn btn-primary mx" @click="modalRoom()">강의실 신규등록</button>
        </span>
      </p>
    </div>
  <div class="divComGrpCodList">
    <table class="col">
      <caption>caption</caption>
      <colgroup>
        <col width="20%">
        <col width="15%">
        <col width="10%">
        <col width="40%">
        <col width="15%">
      </colgroup>

      <thead>
        <tr>
          <th scope="col">강의실 명</th>
          <th scope="col">강의실 크기</th>
          <th scope="col">강의실 자리수</th>
          <th scope="col">비고</th>
          <th scope="col"></th>
        </tr>
      </thead>

      <tbody id="listLectureBody">
        <tr v-for="data in dataList" :key="data.lecrm_id">
          <td @click="$router.push(`Equipmentdetail/${data.lecrm_id}`)">
            {{ data.lecrm_name }}</td>
          <td>{{ data.lecrm_size }}</td>
          <td>{{ data.lecrm_snum }}</td>
          <td>{{ data.lecrm_note }}</td>
          <td>
            <button
              class="btn btn-outline-dark"
              style="margin-right: 15px"
              @click="modalRoom(data.lecrm_id)"
              >
              수정
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Pagination 
  v-bind="{ currentPage, totalItems: total, itemsPerPage: 10 }"
  @search="getLectureList($event)"
  v-if="dataList.length > 0"
  />
  <ModalLerctureRoom 
    v-if="modalState"
    :lectureId="lectureId"
    :lecrmId="lecrmId"
    @closeModal="modalState=$event"
    @closeAndSearch="modalClose"
  />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { axiosAction } from '.';
import {  LectureRoom } from '@/api/api';
import { useRoute } from 'vue-router';
import Pagination from "@/components/common/PaginationComponent.vue";
import ModalLerctureRoom from './ModalLerctureRoom.vue';

const route = useRoute();
const lectureId = ref(route.params.id);
const modalState = ref(false);
const lecrmId = ref(0);
const dataList = ref([]);
const total = ref(0);
const currentPage = ref(0);
const searchRoomName = ref('');


  const getLectureList = async (cpage) => {
    cpage = cpage || 1;
    let param = new URLSearchParams();
    param.append('searchRoomName', searchRoomName.value);
    param.append('cpage', cpage);
    param.append('pagesize', 10);
    param.append('lecrm_id', lecrmId.value);

    const lectureList = await axiosAction(LectureRoom.LectureRoomList,param);

    if(lectureList) {
      dataList.value = lectureList.listdata;
      total.value = lectureList.listcnt;
      currentPage.value = cpage;
    }
  };

  const modalRoom = (param) => {
    modalState.value = true;
    lecrmId.value = param;
  }

  const modalClose = (param) => {
    modalState.value = param;
    getLectureList();
};

  onMounted(() => {
    getLectureList();
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