<template>
    <div>
        <p class="Location">
            <span class="btn_nav bold">학습지원</span>
            <span class="btn_nav bold">강의계획서</span>
        </p>
        <p class="conTitle">
            <span v-if="id">강의계획서</span>
            <!-- <span v-else>강의실 신규등록</span> -->
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
                        <input 
                            type="text" 
                            class="form-control" 
                            v-model="dataDetail.lec_type_name" 
                        />
                    </td>
                    <th class="table-active t-header">대상자 <span style="color: red">*</span></th>
                    <td class="t-data">
                        <input 
                            type="text" 
                            class="form-control" 
                            v-model="dataDetail.lec_sort" 
                        />
                    </td>
                </tr>
                <tr>
                    <th class="table-active t-header">강사명</th>
                    <td class="t-data">{{ dataDetail.name }}</td>
                    <th class="table-active t-header">강의실 <span style="color: red">*</span></th>
                    <td class="t-data">
                        <input 
                            type="text" 
                            class="form-control" 
                            v-model="dataDetail.lecrm_name" 
                        />
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
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosAction } from '.';
import { nullcheck } from '@/common/common';
import { Tut } from '@/api/api';
import WeekPlan from './WeekPlan.vue';

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);

const dataDetail = ref({});






// const lecture = reactive({ lecrm_name: '', lecrm_size: 0, lecrm_snum: 0, lecrm_note: '' });
// const updateHandler = ref(id.value ? 'U' : 'I');
// let preLecture = Object;

// const getLectureDetail = (id) => {
//     let param = new URLSearchParams();
//     param.append('lecrm_id', id);
//     axios.post('/adm/lectureRoomDtl.do', param).then((res) => {
//         lecture.lecrm_name = res.data.selinfo.lecrm_name;
//         lecture.lecrm_size = res.data.selinfo.lecrm_size;
//         lecture.lecrm_snum = res.data.selinfo.lecrm_snum;
//         lecture.lecrm_note = res.data.selinfo.lecrm_note;
//         preLecture = { ...lecture };
//     });
// };

// const postLectureDetail = () => {
//     let checkresult = nullcheck([
//         { inval: lecture.lecrm_name, msg: '강의실 명을 입력해 주세요.' },
//         { inval: lecture.lecrm_size, msg: '강의실 크기을 입력해 주세요.' },
//         { inval: lecture.lecrm_snum, msg: '강의실 자리수을 입력해 주세요.' },
//     ]);
//     if (!checkresult) return;

//     let param = new URLSearchParams(lecture);
//     param.append('action', updateHandler.value);
//     id.value ? param.append('lecrm_id', id.value) : null;

//     axios
//         .post('/adm/lectureRoomSave.do', param)
//         .then((res) => {
//             if (res.data.result === 'S') {
//                 alert('저장되었습니다.');
//                 router.push('/dashboard/sampletest/samplepage5');
//             }
//         })
//         .catch((err) => {
//             alert(err.message);
//         });
// };

const getTutLectureDetail = async () => {
    // var param = {
    //     lec_id : lec_id
    // };
    // callAjax("/tut/fLecInfo.do", "post", "json", true, param, resultCallback);

    let param = new URLSearchParams();
    param.append('lec_id', id.value);

    const lectureDetail = await axiosAction(Tut.TutLectureDetail, param);

    // {"result": "SUCCESS","lec_info": {...},"resultMsg": "조회 되었습니다."}
    if (lectureDetail && lectureDetail.result === 'SUCCESS') {
        console.log("LeturePlanHandle> lectureDetail : " + JSON.stringify(lectureDetail.value));
        dataDetail.value = lectureDetail.lec_info;
    }
};

const postLecInfoDetail = async () => {

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

    console.log("postLecInfoDetail> param : " + param);
    const data = await axiosAction(Tut.TutLectureSave, param);

    // {"result":"SUCCESS","resultMsg":"저장되었습니다."}
    if (data) {
        alert(data.resultMsg);
        if (data.result === "SUCCESS") {
            // emit('closeAndSearch', false);
        }
    }
};

// watch(lecture, (newData) => {
//     if (newData.lecrm_name.length > 15) {
//         alert('15자 이상입니다.');
//         lecture.lecrm_name = preLecture.lecrm_name;
//     }
// });

onMounted(() => {
    console.log("LecturePlanHandle> id : " + id.value);
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
