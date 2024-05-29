<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container" style="width: 500px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>강의 주차별 계획</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <table class="table table-bordered">
                                <colgroup>
                                    <col width="20%">
                                    <col width="80%">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th class="table-active t-header">주차수</th>
                                        <td v-if="dataDetail.lec_id">
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                v-model="dataDetail.week" disabled 
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                v-model="dataDetail.week" 
                                            />                                                
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="table-active t-header">학습목표</th>
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="dataDetail.learn_goal"
                                        />
                                    </tr>
                                    <tr>
                                        <th class="table-active t-header">학습내용</th>
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="dataDetail.learn_con"
                                        />
                                    </tr>
                                </tbody>
                            </table>                            
                        </div>
                        <div class="modal-footer">
                            <button 
                                type="button" 
                                class="btn btn-info" 
                                @click="postWeekPlanDetail" 
                                v-if="!dataDetail.week">등록</button>
                            <template v-else>
                                <button 
                                    type="button" 
                                    class="btn btn-info" 
                                    @click="postWeekPlanDetail">수정</button>
                                <button 
                                    type="button" 
                                    class="btn btn-info" 
                                    @click="deleteWeekPlanDetail">삭제</button>
                            </template>
                            <button 
                                type="button" 
                                class="btn btn-light" 
                                @click="$emit('closeModal', false)">닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { axiosAction } from '.';
import { Tut } from '@/api/api';

const props = defineProps({
    lectureId: Number,
    weekPlan: Object,
});

const updateHandler = ref(props.weekPlan ? 'U' : 'I');
const dataDetail = ref(new Object);
const lectureId = ref(0);
const emit = defineEmits(['closeAndSearch']);


const equipment = ref(new Object());




const postWeekPlanDetail = async () => {

    // data : {
    //     lec_id : lec_id,
    //     week : week,
    //     learn_goal : learn_goal,
    //     learn_con : learn_con
    // }
    // url : "saveWeekplan.do",

    let param = new URLSearchParams(dataDetail.value);
    param.append('action', updateHandler.value);
    param.append('lec_id', props.lectureId);

    console.log("postWeekPlanDetail> param : " + param);
    const data = await axiosAction(Tut.TutLectureWeekPlanSave, param);

    // {"result":"SUCCESS","resultMsg":"저장되었습니다."}
    if (data) {
        alert(data.resultMsg);
        if (data.result === "SUCCESS") {
            emit('closeAndSearch', false);
        }
    }
};

const deleteWeekPlanDetail = async () => {

    // data : {
    //     lec_id : lec_id,
    //     week : week
    // },
    // url : "delWeekPlan.do",

    let param = new URLSearchParams();
    param.append('lec_id', dataDetail.value.lec_id);
    param.append('week', dataDetail.value.week);

    const data = await axiosAction(Tut.TutLectureWeekPlanDelete, param);
    if (data && data.result === "SUCCESS") {
        alert(data.resultMsg);
        emit('closeAndSearch', false);
    }   
};

const getEquipmentDetail = () => {
    let param = new URLSearchParams();
    param.append('equ_id', props.equipId);

    axios.post('/adm/equDtl.do', param).then((res) => {
        equipment.value = res.data.selinfo;
    });
};



onMounted(() => {
    props.lectureId? lectureId.value = props.lectureId : null;
    props.weekPlan ? dataDetail.value = props.weekPlan : null;

    console.log("ModalWeekPlan> props.weekPlan: " + JSON.stringify(dataDetail.value));
    console.log("ModalWeekPlan> props.lectureId : " + lectureId.value);
});
</script>

<style>
.backdrop {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
}
.container {
    background: white;
    padding: 1.5rem;
    height: 50%;
}
.t-header {    
    text-align: center;
    font-weight: bold;
}
.t-data {
    text-align: left;
}
</style>
