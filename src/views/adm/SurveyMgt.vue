<template>
    <div>
        <p class="Location">
            <a class="btn_set home">메인으로</a> 
            <span class="btn_nav bold">학습 관리</span> 
            <span class="btn_nav bold">설문조사 관리</span> 
            <a class="btn_set refresh">새로고침</a>
        </p>
        <p class="conTitle">
            <span>설문조사 관리</span>
        </p>
        <div class="divComGrpCodList">
            <table class="col">
                <caption>caption</caption>
                <colgroup>
                    <col width="30%">
                    <col width="30%">
                    <col width="20%">
                    <col width="20%">
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">강의명</th>
                        <th scope="col">강사</th>
                        <th scope="col">강의 시작일</th>
                        <th scope="col">강의 종료일</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="dataList.length > 0">
                        <tr v-for="(data, i) in dataList" :key="i">
                            <td id="lecName" @click="selectedLectureView(data.lec_id, data.lec_name, data.tutor_name)">
                                {{ data.lec_name }}
                            </td>
                            <td id="lecTutor" @click="selectedTutorView(data.lec_id, data.lec_name, data.tutor_name)">
                                {{ data.tutor_name }}
                            </td>
                            <td>
                                {{ dayjs(data.start_date).format('YY-MM-DD') }}
                            </td>
                            <td>
                                {{ dayjs(data.end_date).format('YY-MM-DD') }}
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="4">
                                <div
                                    style="display: flex; margin: 20px 0px 20px 0px; justify-content: center; color: #8f8f8f;">
                                    해당되는 정보가 없습니다.</div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <Pagination v-bind="{ currentPage, totalItems: total, itemsPerPage: 5 }" @search="searchSurvey($event)"
                v-if="dataList.length > 0" />
        </div>
        <div v-if="isClickedOption">
            <p class="conTitle">
                <span>설문조사 상세 - {{ selectedName }}</span>
            </p>
            <table class="col">
                <caption>caption</caption>
                <colgroup>
                    <col width="30%">
                    <col width="30%">
                    <col width="20%">
                    <col width="20%">
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">강의명</th>
                        <th scope="col">강사</th>
                        <th scope="col">설문조사 참여 현황</th>
                        <th scope="col">설문조사 결과</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="selectedName === '강의명'">
                        <tr v-for="(data, i) in detailSrvyList" :key="i">
                            <td>
                                {{ data.lec_name }}
                            </td>
                            <td>
                                {{ data.tutor_name }}
                            </td>
                            <td>
                                {{ data.survey_percentage }} %
                            </td>
                            <td v-if="data.survey_percentage <= 80">
                                <a class='btnType blue' @click="surveyResult(data.lec_id)"><span>결과
                                        확인</span></a>
                                {{ data.srvy_yn }}
                            </td>
                            <td v-else>
                                <span style='background-color: gray; padding: 7px 20px 7px 20px; color: white;'>확인
                                    불가능</span>
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="(data, i) in detailSrvyTutorNmList" :key="i">
                            <td>
                                {{ data.lec_name }}
                            </td>
                            <td>
                                {{ data.tutor_name }}
                            </td>
                            <td>
                                {{ data.survey_percentage }} %
                            </td>
                            <td v-if="data.survey_percentage <= 80">
                                <a class='btnType blue' @click="surveyResult(data.lec_id)"><span>결과
                                        확인</span></a>
                                {{ data.srvy_yn }}
                            </td>
                            <td v-else>
                                <span style='background-color: gray; padding: 7px 20px 7px 20px; color: white;'>확인
                                    불가능</span>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <Pagination
                v-bind="{ currentPage: selectedTutorCurrentPage, totalItems: selectedTutorTotal, itemsPerPage: 2 }"
                @search="selectedTutorView(paramObj.lec_id, paramObj.lec_name, paramObj.tutor_name, $event)"
                v-if="selectedTutorTotal > 0" />
        </div>

        <div id="resultSrvy" style="margin-top: 40px;" v-if="resultVisible">
            <!-- 이 안에도 같이 비워져서 오류가 남 -->
            <div>
                <canvas id="doughnut-chart"></canvas>
            </div>
        </div>
        <p class="conTitle" id="resultSrvyReview" v-if="reviewVisible">
            <span style="font-size: 16px; margin-top: 20px">학습 시 불편했던 사항 또는 개선할 사항</span>
        </p>
        <div id="listReviewContainer" style="padding: 15px 0px 50px 50px;"></div>

    </div>

</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import Pagination from '@/components/common/PaginationComponent.vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const dataList = ref([]);
const total = ref(0);
const currentPage = ref(0);
let isClickedOption = ref(false);
let selectedName = ref();
const selectedTutorTotal = ref(0);
const selectedTutorCurrentPage = ref(0);

const detailSrvyList = ref([]);
const detailSrvyTutorNmList = ref([]);

const resultVisible = ref(false);
const reviewVisible = ref(false);
const listReviewVisible = ref(false);

let paramObj = ref({ lec_id: 0, lec_name: '', tutor_name: '' });

const searchSurvey = (cpage) => {
    cpage = cpage || 1;
    let param = new URLSearchParams();
    param.append("cpage", cpage);
    param.append("pagesize", 5);
    const loginInfo = JSON.parse(sessionStorage.getItem('loginInfo'));
    if (loginInfo.userType === 'C') {
        axios.post('/adm/a_surveyListJson.do', param).then((res) => {
            dataList.value = res.data.listdata;
            total.value = res.data.listcnt;
            currentPage.value = cpage;
        });
    } else {
        param.append("loginId", sessionStorage.getItem('loginId'));
        axios.post('/tut/t_surveyTutorListJson.do', param).then((res) => {
            dataList.value = res.data.listdata;
            total.value = res.data.listcnt;
            currentPage.value = cpage;
        });
    }
};
const selectedLectureView = (lec_id, lec_name, tutor_name) => {
    isClickedOption.value = true;
    selectedName.value = '강의명';
    let param = new URLSearchParams();
    param.append("lec_id", lec_id);
    param.append("lec_name", lec_name);
    param.append("tutor_name", tutor_name);

    axios.post('/adm/detailSrvyList', param).then((res) => {
        detailSrvyList.value = res.data.detailSrvyList;
    });
};

const selectedTutorView = (lec_id, lec_name, tutor_name, cpage) => {
    isClickedOption.value = true;
    cpage = cpage || 1;
    selectedName.value = '강사명';

    if (lec_id && lec_name && tutor_name && (cpage === 1)) {
        paramObj.value = { lec_id, lec_name, tutor_name };
    }

    let param = new URLSearchParams();
    param.append("lec_id", paramObj.value.lec_id);
    param.append("lec_name", paramObj.value.lec_name);
    param.append("tutor_name", paramObj.value.tutor_name);
    param.append("cpage", cpage);
    param.append("pagesize", 2);

    axios.post('/adm/detailTutorNmSrvyList', param).then((res) => {
        detailSrvyTutorNmList.value = res.data.detailSrvyTutorNmList;
        selectedTutorTotal.value = res.data.detailNmTotalCnt;
        selectedTutorCurrentPage.value = cpage;
    });
};

const surveyResult = (lec_id) => {
    resultVisible.value = true;
    reviewVisible.value = true;
    listReviewVisible.value = true;
    let param = new URLSearchParams();
    param.append("lec_id", lec_id);
    axios.post('/adm/surveyResult', param).then((res) => {
        showchart(res.data);
    });

};

const showchart = (data) => {
    showList(data.resultList);
    var resultSrvyGraph = document.getElementById("resultSrvy");
    resultSrvyGraph.innerHTML = "";

    data.resultNumList.forEach(function (data) {
        const srvyResultData = data;

        var canvas = document.createElement('canvas');
        resultSrvyGraph.appendChild(canvas);

        var myChart = new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ["매우 그렇다", "그렇다", "보통이다", "그렇지 않다", "매우 그렇지 않다"],
                datasets: [{
                    label: srvyResultData.lec_name,
                    backgroundColor: ["#70fff3", "#b3ff70", "#fff170", "#ffb870", "#ff7070"],
                    data: [
                        srvyResultData.review_num_5
                        , srvyResultData.review_num_4
                        , srvyResultData.review_num_3
                        , srvyResultData.review_num_2
                        , srvyResultData.review_num_1
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: (srvyResultData.que_num + 1) + "번. " + srvyResultData.que,
                },
                responsive: true,
                layout: {
                    padding: {
                        bottom: 50
                    }
                },

            }
        });
    });
};

const showList = (data) => {
    const listReviewContainer = document.getElementById("listReviewContainer");
    listReviewContainer.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.textContent = item.review;
        listReviewContainer.appendChild(div);
    });
};

onMounted(() => {
    searchSurvey();
});
</script>

<style></style>
