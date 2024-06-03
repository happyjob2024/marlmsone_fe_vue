<template>
<div class="content">
    <p class="Location">
        <a class="btn_set home">메인으로</a> 
        <span class="btn_nav bold">시설 관리</span> 
        <span class="btn_nav bold"> 장비 관리</span> 
        <a class="btn_set refresh">새로고침</a>
    </p>

<div>
    <p class="conTitle">
        <span>장비 관리</span>
        <span class="fr">
        <select v-model="selected">
            <option v-for="option in searchOption"
                :key="option.value"
                :value="option.value"
            > {{ option.text }}
            </option>	
        </select>
        <input type="text" class="lecure-name"
            style="height: 28px;" 
            v-model="searchName"
        />
            <button class="btn btn-primary mx-1"  @click="getEquipmentList()">검색</button>
            <button class="btn btn-primary mx-1" @click="modalRoom()">장비 신규등록</button>
        </span>
    </p>
</div>   
<div class="divEquList divComGrpCodList">
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
                <th scope="col">장비 명</th>
                <th scope="col">장비 수</th>
                <th scope="col">비고</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="data in dataList" :key="data.lecrm_id">
                <td>{{ data.lecrm_name }}</td>
                <td>{{ data.equ_name }}</td>
                <td>{{ data.equ_num }}</td>
                <td>{{ data.equ_note }}</td>
                <td>
                    <button
                    class="btn btn-outline-dark"
                    style="margin-right: 15px"
                    @click="modalRoom(data.equ_id)"
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
  @search="getEquipmentList($event)"
  v-if="dataList.length > 0"
 /> 
<ModalEquManagement 
    v-if="modalState"
    :lectureId="lectureId"
    :equId="equId"
    @closeModal="modalState=$event"
    @closeAndSearch="modalClose"
/>
</div>

</template>

<script setup>
import { EquManagementList } from '@/api/api';
import { onMounted, ref } from 'vue';
import { axiosAction } from '.';
import { useRoute } from 'vue-router';
import ModalEquManagement from './ModalEquManagement.vue';
import Pagination from "@/components/common/PaginationComponent.vue";


const route = useRoute();
const lectureId = ref(route.params.id);
const modalState = ref(false);
const equId = ref(0);
const dataList = ref([]);
const total = ref(0);
const currentPage = ref(0);
//옵션조건
const selected = ref('room');
const searchOption = ref([
    { text: '강의실 명', value: 'room'},
    { text: '장비 명', value: 'equ'}
]);         
const searchName = ref('');


const getEquipmentList = async (cpage) => {
    cpage = cpage || 1;
    let param = new URLSearchParams();
    param.append('cpage', cpage);
    param.append('pageSize', 10);
    param.append('searchOption', selected.value);
    param.append('searchName', searchName.value);
    param.append('lecrm_id', lectureId.value);

    const ementList = await axiosAction(EquManagementList.EquManagementList,param);
    if(ementList){
        dataList.value = ementList.listdata;
        total.value = ementList.listcnt;
        currentPage.value = cpage;
    }
};

const modalRoom = (param) => {
    modalState.value = true;
    equId.value = param;
  };

  const modalClose = (param) => {
    modalState.value = param;
    getEquipmentList();
};

onMounted(() => {
    getEquipmentList();
});

</script>

<style>

</style>