<template>
    <div>
        <p class="Location">
            <span class="btn_nav bold">학습관리</span>
            <span class="btn_nav bold">성적조회</span>
        </p>
        <p class="conTitle">
            <span class="conNm">시험목록</span>
            <span class="fr">
                <select v-model="selected">
                    <option v-for="option in selectOptions" 
                            :key="option.value" 
                            :value="option.value"
                    > {{ option.text }}
                    </option>
                </select>
                <input type="text" class="lecure-name" style="margin-left: 10px;" v-model="searchWord"/>
                <button class="btn btn-secondary btn-sm" @click="getTutLectureList()">검색</button>
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
                    <th class="t-header">강의명</th>
                    <th class="t-header">시험명</th>
                    <th class="t-header">상태</th>
                    <th class="t-header">대상</th>
                    <th class="t-header">응시자 수</th>
                    <th class="t-header">미응시자 수</th>
                </tr>
            </thead>            
            <tbody>
                <!-- {"checkgradeList": [{
                    "lec_id": 1,"std_id": null,"test_id": 1,"que_id": 0,"test_name": "자바 Test",
                    "lec_type_id": 1,"lec_type_name": null,"pre_pnum": 0,"loginID": null,"pass": null,
                    "test_score": 0,"lec_name": "자바의이해","start_date": null,"end_date": null,
                    "lecStatus": "강의중","cnt": 4,"noTest": -4,"name": null,
                    "test_yn": null,"tutor_id": null}], "totalGradeCnt": 6} -->
                <template v-if="dataTotalCnt > 0">
                    <tr v-for="data in dataList" :key="data.lec_id">
                        <td>{{ data.lec_name }}</td>
                        <!-- <td @click="$router.push(`checkGradesDetail/${data.lec_id}`)">{{ data.test_name }}</td> -->
                        <td @click="stdListHandler(data.lec_id)">{{ data.test_name }}</td>
                        <td>{{ data.lecStatus }}</td>
                        <td>{{ data.pre_pnum }}</td>
                        <td>{{ data.cnt }}</td>
                        <td>{{ data.noTest }}</td>
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
            @search="getTutLectureList($event)"
            v-if="dataList.length > 0"
        />
        <div>
            <StdGrades
                v-if="stdGradesListBoolean"
                :lectureId="selLectureId"/>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { axiosAction } from '.';
import { Tut } from '@/api/api';
import Pagination from '@/components/common/PaginationComponent.vue';
import StdGrades from './StdGrades.vue';

const stdGradesListBoolean = ref(false);
const selLectureId = ref(0);


const currentPage = ref(1);
const pageSize = 5;
const pageBlockSize = 5;

const searchWord = ref('');
const selected = ref('all');
const selectOptions = ref([
    { text: '전체', value: 'all' },
    { text: '강의명', value: 'lec_name' },
    { text: '시험명', value: 'test_name' }
]);

const dataList = ref([]);
const dataTotalCnt = ref(0);

// 강사 시험목록 조회
const getTutLectureList = async (cpage) => {
    cpage = cpage || 1;

    // var param = {
    //     cpage: cpage,
    //     pagesize : pagesize,
    //     pageblocksize : pageblocksize,
    //     searchInfo : $("#searchInfo").val(),
    //     searchKey : $("#searchKey").val()
    // }
    // callAjax("/tut/checkGradesList.do", "post", "text", false, param, listCallback );

    let param = new URLSearchParams();
    param.append('cpage', cpage);
    param.append('pagesize', pageSize);
    param.append('pageblocksize', pageBlockSize);
    param.append('searchInfo', searchWord.value);
    param.append('searchKey', selected.value);
    stdGradesListBoolean.value = false;

    const tutCheckGradesList = await axiosAction(Tut.TutCheckGradesList, param);

    // {"checkgradeList": [{...}], "totalGradeCnt": 6}
    if (tutCheckGradesList) {
        dataList.value = tutCheckGradesList.checkgradeList;
        dataTotalCnt.value = tutCheckGradesList.totalGradeCnt;
        currentPage.value = cpage;
    }
};

const stdListHandler = (param) => {
    console.log("###### " + param);
    stdGradesListBoolean.value = true;
    selLectureId.value = param;
};

onMounted(() => {
    getTutLectureList();
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

.t-header {
    text-align: center;
    font-weight: bold;
}
</style>
