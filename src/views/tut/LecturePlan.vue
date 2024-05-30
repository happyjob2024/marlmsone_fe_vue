<template>
    <div>
        <p class="Location">
            <span class="btn_nav bold">학습지원</span>
            <span class="btn_nav bold">강의계획서</span>
        </p>
        <p class="conTitle">
            <span class="conNm">강의계획서 관리</span>
            <span class="fr">
                <select v-model="selected">
                    <option v-for="option in selectOptions" 
                            :key="option.value" 
                            :value="option.value"
                    > {{ option.text }}
                    </option>
                </select>
                <span>강의명 </span>
                <input type="text" class="lecure-name" v-model="searchWord"/>
                <button class="btn btn-secondary btn-sm" @click="searchTutLecture()">검색</button>
            </span>
        </p>
        <div>
            <div>
                <b> 총건수 : {{ dataTotalCnt }} , 현재 페이지 번호 : {{ currentPage }} </b>
            </div>
        </div>
        <table class="table table-hover" style="margin-top: 1%; text-align: center">
            <thead class="table-active">
                <tr>
                    <th class="t-header-c">분류</th>
                    <th class="t-header-c">강의명</th>
                    <th class="t-header-c">기간</th>
                    <th class="t-header-c">수강인원</th>
                </tr>
            </thead>            
            <tbody>
                <!-- {"listcnt": 4,
                "listdata": [{
                    "lec_id": 87, "lecrm_id": 0, "lecrm_name": null, "max_pnum": 10, "pre_pnum": 1,
                    "start_date": "2024.05.01", "end_date": "2024.05.30", "process_day": 0,
                    "test_id": 0, "test_start": null, "test_end": null, "tutor_id": null,
                    "lec_name": "스마트웹&콘텐츠 개발", "lec_goal": null, "lec_type_id": "1",
                    "loginID": null, "name": null, "tel": null, "mail": null, "lec_type_name": "Java",
                    "week": null, "learn_goal": null, "learn_con": null, "lec_sort": "직장인"}]} -->
                <template v-if="dataTotalCnt > 0">
                    <tr v-for="data in dataList" :key="data.lec_id">
                        <td>{{ data.lec_type_name }}</td>
                        <td @click="$router.push(`lecturePlanDetail/${data.lec_id}`)">{{ data.lec_name }}</td>
                        <td>{{ data.start_date }} ~ {{ data.end_date }}</td>
                        <td>{{ data.pre_pnum }}</td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="4">데이터가 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            v-bind="{ currentPage, totalItems: dataTotalCnt, itemsPerPage: pageSize }"
            @search="searchTutLecture($event)"
            v-if="dataList.length > 0"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { axiosAction } from '.';
import { Tut } from '@/api/api';
import Pagination from '@/components/common/PaginationComponent.vue';

const pageSize = 6;
const currentPage = ref(0);
const searchWord = ref('');
const selected = ref('ing');
const selectOptions = ref([
    { text: '진행중 강의', value: 'ing' },
    { text: '종료된 강의', value: 'end' }
]);

const dataList = ref([]);
const dataTotalCnt = ref(0);

// 강사 강의목록 조회
const searchTutLecture = async (cpage) => {
    cpage = cpage || 1;

    // var param = {
    //     searchKey : searchKey,
    //     searchWord : searchWord,
    //     currentPage : currentPage,
    //     pageSize : pageSize,
    //     progress : progress
    // }
    // callAjax("/tut/fLectureList.do", "post", "text", true, param, resultCallback);

    let param = new URLSearchParams();
    param.append('searchWord', searchWord.value);
    param.append('currentPage', cpage);
    param.append('pageSize', pageSize);
    param.append('progress', selected.value);

    const tutLectureList = await axiosAction(Tut.TutLectureList, param);

    // {"listcnt": 4, "listdata": [{...}]}
    if (tutLectureList) {
        dataList.value = tutLectureList.listdata;
        dataTotalCnt.value = tutLectureList.listcnt;
        currentPage.value = cpage;
    }
};

onMounted(() => {
    searchTutLecture();
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
.t-header-c {
    text-align: center;
    font-weight: bold;
}
</style>
