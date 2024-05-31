<template>
    <div style="margin-top: 5%">
        <p class="conTitle">
            <span class="conNm">시험응시 학생목록</span>
        </p>        
        <div>
            <div style="font-size: 18px; margin-left: 2%">
                <b>{{ props.lectureName }} : {{ props.testName }}</b>
            </div>
            <div class="fr" style="margin: 1%;">
                <b> 총건수 : {{ dataTotalCnt }} , 현재 페이지 번호 : {{ currentPage }} </b>
            </div>
        </div>
        <table class="table table-hover" style="margin-top: 1%; text-align: center">
            <thead class="table-active">

                <tr>
                    <th class="t-header">아이디</th>
                    <th class="t-header">학생명</th>
                    <th class="t-header">점수</th>
                    <th class="t-header">통과/과락</th>
                    <th class="t-header">응시상태</th>
                </tr>
            </thead>            
            <tbody>
                <!-- {"checkStdCount": 4,
                    "checkStdList": [{"lec_id": 0,"std_id": null,"test_id": 0,"que_id": 0,"test_name": null,
                        "lec_type_id": 0,"lec_type_name": null,"pre_pnum": 0,"loginID": "123123","pass": "과락",
                        "test_score": 43,"lec_name": null,"start_date": null,"end_date": null,"lecStatus": null,
                        "cnt": 0,"noTest": 0,"name": "123","test_yn": "미응시","tutor_id": null}]} -->

                <template v-if="dataTotalCnt > 0">
                    <tr v-for="data in dataList" :key="data.loginID">
                        <td>{{ data.loginID }}</td>
                        <td>{{ data.name }}</td>
                        <td>{{ data.test_score }}</td>
                        <td>{{ data.pass }}</td>
                        <td>{{ data.test_yn }}</td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="5">데이터가 없습니다</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            v-bind="{ currentPage, totalItems: dataTotalCnt, itemsPerPage: pageSize }"
            @search="getStdGradesList($event)"
            v-if="dataList.length > 0"
        />
    </div>
</template>

<script setup>
import { onMounted, ref, watch  } from 'vue';
import { axiosAction } from '.';
import { Tut } from '@/api/api';
import Pagination from '@/components/common/PaginationComponent.vue';

const props = defineProps({
    lectureId: Number,
    lectureName: Object,
    testName: Object,
});

const currentPage = ref(1);
const pageSize = 5;
const pageBlockSize = 5;

const dataList = ref([]);
const dataTotalCnt = ref(0);

// 시험응시 학생목록 조회
const getStdGradesList = async (cpage) => {
    cpage = cpage || 1;

    // var param = {
    //     lec_id : $("#lec_id").val(),
    //     cpage: cpage,
    //     pagesize : pagesize,
    //     pageblocksize : pageblocksize,
    // };
    // callAjax("/tut/checkStdList.do", "post", "text", false, param, listCallback );

    let param = new URLSearchParams();
    param.append('lec_id', props.lectureId);
    param.append('cpage', cpage);
    param.append('pagesize', pageSize);
    param.append('pageblocksize', pageBlockSize);

    const stdGradesList = await axiosAction(Tut.StdGradesList, param);

    // {"checkStdCount": 4,"checkStdList": [{...}]}
    if (stdGradesList) {
        dataList.value = stdGradesList.checkStdList;
        dataTotalCnt.value = stdGradesList.checkStdCount;

        currentPage.value = cpage;

        // console.log("StdGrades> checkStdList : " + JSON.stringify(dataList.value));
        // console.log("StdGrades> checkStdCount : " + dataTotalCnt.value);
    }
};

watch(props, () => {
    // console.log("StdGrades> WATCH!!! props.lectureId=" + props.lectureId);
    getStdGradesList();
});

onMounted(() => {
    // console.log("StdGrades> lectureId : " + props.lectureId);
    props.lectureId ? getStdGradesList() : null;
});
</script>

<style>
.t-header {
    text-align: left;
    vertical-align: middle;
    font-weight: bold;
}
.t-data {
    text-align: left;
    vertical-align: middle;
}
</style>
