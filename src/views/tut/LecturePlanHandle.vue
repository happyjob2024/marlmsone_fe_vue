<template>
    <div>
        <p class="Location">
            <span class="btn_nav bold">학습지원</span>
            <span class="btn_nav bold">강의계획서</span>
        </p>
        <p class="conTitle">
            <span>강의계획서</span>
            <button class="btn btn-light" 
                    style="float: inline-end; margin-top: 10px" 
                    @click="postLecInfoDetail">
                수정
            </button>
                <button class="btn btn-light" 
                        style="float: inline-end; margin-top: 10px" 
                        @click="router.back()">
                목록보기
            </button>
        </p>
        <!-- "lec_info": {"lec_id": 87,"lecrm_id": 0,"lecrm_name": null,"max_pnum": 10,"pre_pnum": 1,
                "start_date": "2024-05-01","end_date": "2024-05-30","process_day": 0,
                "test_id": 0,"test_start": null,"test_end": null,"tutor_id": "bbb123","lec_name": "스마트웹&콘텐츠 개발",
                "lec_goal": "본 과정은 실무에 활용되고 있는 기술들을 학습하고 실습을 통해 실무 환경을 경험해 보고 수료 후 취업을 위한 포트폴리오 제작까지 할 수 있는 실무중심 취업대비 과정입니다.",
                "lec_type_id": "1","loginID": "bbb123","name": "스티븐잡스","tel": "010-8478-6861","mail": "soobin84786861@gmail.com",
                "lec_type_name": "Java","week": null,"learn_goal": null,"learn_con": null,"lec_sort": "직장인"
        }, -->
        <table class="table table-bordered" style="margin-top: 1%; text-align: center">
            <colgroup>
                <col width="15%">
                <col width="35%">
                <col width="15%">
                <col width="35%">
            </colgroup>
            <tbody>
                <tr>
                    <th class="table-active t-header">과목 <span style="color: red">*</span></th>
                    <td class="t-data" colspan="3">{{ dataDetail.lec_name }}</td>
                </tr>
                <tr>
                    <th class="table-active t-header">강의분류 <span style="color: red">*</span></th>
                    <td class="t-data">
                        <select v-model="dataDetail.lec_type_id">
                            <option value="">강의분류 선택</option>
                            <option v-for="option in lecTypeList" 
                                :key="option.lec_type_id" 
                                :value="option.lec_type_id"
                            > {{ option.lec_type_name }}
                            </option>
                        </select>
                    </td>
                    <th class="table-active t-header">대상자 <span style="color: red">*</span></th>
                    <td class="t-data">
                        <select v-model="dataDetail.lec_sort">
                            <option value="">대상자 선택</option>
                            <option value="실업자">실업자</option>
                            <option value="직장인">직장인</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th class="table-active t-header">강사명</th>
                    <td class="t-data">{{ dataDetail.name }}</td>
                    <th class="table-active t-header">강의실 <span style="color: red">*</span></th>
                    <td class="t-data">
                        <select v-model="dataDetail.lecrm_id">
                            <option value="">강의실 선택</option>
                            <option v-for="option in lecRoomList" 
                                :key="option.lecrm_id" 
                                :value="option.lecrm_id"
                            > {{ option.lecrm_name }}
                            </option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th class="table-active t-header">이메일</th>
                    <td class="t-data">{{ dataDetail.mail }}</td>
                    <th class="table-active t-header">연락처</th>
                    <td class="t-data">{{ dataDetail.tel }}</td>
                </tr>
                <tr>
                    <th class="table-active t-header">수업목표</th>
                    <td colspan="3">
                        <textarea 
                            class="form-control" 
                            v-model="dataDetail.lec_goal"
                            rows="4" 
                        ></textarea>
                    </td>
                </tr>
            </tbody>
        </table>
        <div>
            <WeekPlan :lectureId="id"/>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosAction } from '.';
import { nullcheck } from '@/common/common';
import { Tut } from '@/api/api';
import WeekPlan from './WeekPlan.vue';

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);

const dataDetail = ref({});
const lecTypeList = ref([]);
const lecRoomList = ref([]);

// 강의 상세정보, 강의분류 리스트, 강의실 리스트 조회
const getTutLectureDetail = async () => {    
    // var param = {
    //     lec_id : lec_id
    // };
    // callAjax("/tut/fLecInfo.do", "post", "json", true, param, resultCallback);

    let param = new URLSearchParams();
    param.append('lec_id', id.value);

    const lectureDetail = await axiosAction(Tut.TutLectureDetail, param);

    // {"result": "SUCCESS","lec_info": {...},"type_list": {...},"lec_room": {...},"resultMsg": "조회 되었습니다."}
    if (lectureDetail && lectureDetail.result === 'SUCCESS') {
        dataDetail.value = lectureDetail.lec_info;
        lecTypeList.value = lectureDetail.type_list;
        lecRoomList.value = lectureDetail.lec_room;

        // console.log("LeturePlanHandle> lectureDetail : " + JSON.stringify(dataDetail.value));
        // console.log("LeturePlanHandle> lecTypeList : " + JSON.stringify(lecTypeList.value));
        // console.log("LeturePlanHandle> lecRoomList : " + JSON.stringify(lecRoomList.value));
    }
};

// 강의 상세정보 수정
const postLecInfoDetail = async () => {
    let checkresult = nullcheck([
        { inval: dataDetail.value.lec_type_id, msg: '강의분류를 선택해 주세요.' },
        { inval: dataDetail.value.lec_sort, msg: '대상자를 선택해 주세요.' },
        { inval: dataDetail.value.lecrm_id, msg: '강의실을 선택해 주세요.' },
    ]);
    if (!checkresult) return;

    // var param = {
    //     lec_id :  $("#tmp_lec").val(),
    //     tutor_id :$("#tutor_id").val(),
    //     lec_goal :$("#lec_goal").val(),
    //     lecrm_id :$("#lecrm_name").val(),
    //     lec_type_id :$("#lec_type_name").val(),
    //     lec_sort : $("#lec_sort").val()
    // }
    // callAjax("/tut/savePlan.do", "post", "json", true, param, resultCallback);

    let param = new URLSearchParams(dataDetail.value);
    // console.log("postLecInfoDetail> param : " + param);

    const data = await axiosAction(Tut.TutLectureSave, param);

    // {"result":"SUCCESS","resultMsg":"저장되었습니다."}
    if (data) {
        alert(data.resultMsg);
        if (data.result === "SUCCESS") {
            // emit('closeAndSearch', false);
        }
    }
};

onMounted(() => {
    // console.log("LecturePlanHandle> id : " + id.value);
    id.value ? getTutLectureDetail(id.value) : null;
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
