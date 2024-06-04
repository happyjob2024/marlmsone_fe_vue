<template>
    <div id="notice">
        <p class="Location">
            <a href="/dashboard/home" class="btn_set home"></a>
            <span class="btn_nav bold">학습지원</span>
            <span class="btn_nav bold">강의목록</span>
        </p>
        <p class="conTitle">
            <span>강의목록</span>
            <span>
                <select v-model="searchKey">
                    <option value="all" selected="selected">전체</option>
                    <option value="name">강사명</option>
                    <option value="lec_name">강의명</option>
                </select>
                <input 
                    type="text"
                    style="width: 200px"
                    v-model="searchInfo"
                >
                <button class="btn btn-primary btn-sm" @click="searchLecture()">검색</button>
            </span>
        </p>

        <LectureTable :dataList="dataList" />

        <Pagination 
            v-bind="{ currentPage, totalItems: listCount, itemsPerPage: 5 }"
            @search="searchLecture($event)"
            v-if="dataList.length > 0"
        />
    </div>
</template>

<script setup>
import Pagination from '@/components/common/PaginationComponent.vue';
import LectureTable from './LectureTable.vue';
import axios from 'axios';
import { onMounted, provide, ref } from 'vue';

    const dataList = ref([]);
    const listCount = ref(0);
    const currentPage = ref(1);
    const searchKey = ref('all');
    const searchInfo = ref('');

    const searchLecture = (page) => {
        page = page || 1;
        let param = new URLSearchParams();
        param.append('currentPage', page);
        param.append('pageSize', 5);
        param.append('searchKey', searchKey.value);
        param.append('searchInfo', searchInfo.value);

        axios.post('/std/listLecture.do', param).then((res) => {
            dataList.value = res.data.lecList;
            listCount.value = res.data.lecTotal;
            currentPage.value = page;
        });
    };

    provide('test', searchLecture);

    onMounted(() => {
        searchLecture();
    });

</script>

<style>
.conTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>