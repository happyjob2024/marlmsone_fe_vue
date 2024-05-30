<template>
    <div style="margin-top: 70px">
        <div>
            <p class="conTitle">
                <span>주차별 강의 계획</span>
                <button 
                    class="btn btn-light" 
                    style="float: right; 
                    margin-top: 10px" 
                    @click="modalHandler()">
                    주차 계획 신규등록
                </button>
            </p>
            <!-- <table class="table table-bordered" style="margin-top: 1%"> -->
            <table class="table table-bordered">
                <colgroup>
                    <col width="15%">
                    <col width="35%">
                    <col width="35">
                    <col width="15%">
                </colgroup>
                <thead class="table-active">
                    <tr>
                        <th class="t-header-c">주차수</th>
                        <th class="t-header-c">학습목표</th>
                        <th class="t-header-c">학습내용</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <!-- "week_plan": [{"lec_id": 87,"lecrm_id": 0,"lecrm_name": null,"max_pnum": 0,"pre_pnum": 0,
                        "start_date": null,"end_date": null,"process_day": 0,"test_id": 0,"test_start": null,"test_end": null,
                        "tutor_id": null, "lec_name": null, "lec_goal": null, "lec_type_id": null,
                        "loginID": null,"name": null,"tel": null,"mail": null,"lec_type_name": null,
                        "week": "1주차","learn_goal": "mvc구현","learn_con": "springboot","lec_sort": null}], -->
                    <template v-if="dataList.length > 0">
                        <tr v-for="data in dataList" :key="data.lec_id + data.week">
                        <td class="t-data-c">{{ data.week }}</td>
                        <td class="t-data-l">{{ data.learn_goal }}</td>
                        <td class="t-data-l">{{ data.learn_con }}</td>
                        <td class="t-button">
                            <button
                                class="btn btn-outline-secondary btn-sm"
                                @click="modalHandler(data)"
                            >
                                수정
                            </button>
                        </td>
                    </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="4" style="text-align: center">데이터가 없습니다</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <ModalWeekPlan
            v-if="modalBoolean"
            :lectureId="props.lectureId"
            :weekPlan="weekPlan"
            @closeModal="modalBoolean = $event"
            @closeAndSearch="modalClose"
        />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { axiosAction } from '.';
import { Tut } from '@/api/api';
import ModalWeekPlan from './ModalWeekPlan.vue';

const weekPlan = ref({});
const dataList = ref([]);
const modalBoolean = ref(false);

const props = defineProps({
    lectureId: Number,
});

// 강의 주간계획 전체 조회
const getWeekPlanList = async () => {

    // var param = {
    //     lec_id : lec_id
    // };
    // callAjax("/tut/WeekplanList.do", "post", "json", true, param, resultCallback);

    let param = new URLSearchParams();
    param.append('lec_id', props.lectureId);

    const weekPlanList = await axiosAction(Tut.TutLectureWeekPlanList, param);

    // {"result": "SUCCESS","week_plan": [{...}],"resultMsg": "조회 되었습니다."}
    if (weekPlanList && weekPlanList.result === "SUCCESS") {
        // console.log("WeekPlan> weekPlanList : " + JSON.stringify(weekPlanList));
        dataList.value = weekPlanList.week_plan;
    }
};

const modalHandler = (param) => {
    modalBoolean.value = true;
    weekPlan.value = param;
};

const modalClose = (param) => {
    modalBoolean.value = param;
    getWeekPlanList();
};

onMounted(() => {
    props.lectureId ? getWeekPlanList() : null;
});
</script>

<style>
.t-header-c {
    text-align: center;
    vertical-align: middle;
    font-weight: bold;
}
.t-data-l {
    text-align: left;
    vertical-align: middle;
}
.t-data-c {
    text-align: center;
    vertical-align: middle;
}
.t-button {
    display: flex; 
    justify-content: center; 
    align-items: center;
}
</style>
