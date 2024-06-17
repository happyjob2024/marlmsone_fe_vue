<template>
    <div>
        <p class="Location">
            <span class="btn_nav bold">통계</span>
            <span class="btn_nav bold">수강인원</span>
        </p>
        <p class="conTitle">
            <span class="conNm">수강인원</span>
            <span class="fr">
                <select v-model="selected">
                    <option v-for="option in selectOptions" 
                            :key="option.value" 
                            :value="option.value"
                    > {{ option.text }}
                    </option>
                </select>                
                <input type="text" 
                    class="lecure-name" 
                    style="margin-left:10px; margin-right: 10px" 
                    v-model="searchWord"/>
                <button class="btn btn-primary" @click="searchLectureList()">검색</button>
            </span>
        </p>
        <span class="fr">
            <strong>수업일 조회 </strong>
            <input type="date" v-model="fromDate"> ~ <input type="date" v-model="toDate">
            <button class="btn btn-primary" 
                style="margin-left: 10px"
                @click="searchLectureList()">조회</button>
            <!-- <a class="btnType blue" href="javascript:sLectureList()" name="search">
                <span id="searchEnter">조회</span>
            </a> -->
        </span>
        <div style="margin-top: 50px;">
            <div>
                <b> 총건수 : {{ dataTotalCnt }} , 현재 페이지 번호 : {{ currentPage }} </b>
            </div>
        </div>
        <div class="row">
            <CardCourseSize v-for="data in dataList"
                            :key="data.lec_id"
                            :data="data"/>
        </div>
        <Pagination
            v-bind="{ currentPage, totalItems: dataTotalCnt, itemsPerPage: pageSize }"
            @search="searchLectureList($event)"
            v-if="dataList.length > 0"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { CourseSize } from '@/api/api';
import { axiosAction } from '.';
import Pagination from '@/components/common/PaginationComponent.vue';
import CardCourseSize from './CardCourseSize.vue';

const pageSize = 6;
const currentPage = ref(0);

const selected = ref('all');
const selectOptions = ref([
    { text: '전체', value: 'all' },
    { text: '강의명', value: 'lec_name' },
    { text: '강사명', value: 'tutor_name' },
]);
const searchWord = ref('');
const fromDate = ref('');
const toDate = ref('');

const dataList = ref([]);
const dataTotalCnt = ref(0);


// 강의목록 조회
const searchLectureList = async (cpage) => {
    cpage = cpage || 1;

    // var param = {
    //     searchKey : searchKey,
    //     searchWord : searchWord,
    //     currentPage : currentPage,
    //     pageSize : pageSize,
    //     from_date : from_date,
    //     to_date : to_date
    // }
    // callAjax("/adm/selectCourse.do", "post", "text", true, param, resultCallback);

    let param = new URLSearchParams();
    param.append('searchKey', selected.value);
    param.append('searchWord', searchWord.value);
    param.append('currentPage', cpage);
    param.append('pageSize', pageSize);
    param.append('from_date', fromDate.value);
    param.append('to_date', toDate.value);

    const lectureList = await axiosAction(CourseSize.GetLectureList, param);

    // {"totalCnt": 27,"lecList": [{...}],"pageSize": 6,"currentPage": 1}
    if (lectureList) {
        dataList.value = lectureList.lecList;
        dataTotalCnt.value = lectureList.totalCnt;

        currentPage.value = cpage;
    }
};

onMounted(() => {
    searchLectureList();
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