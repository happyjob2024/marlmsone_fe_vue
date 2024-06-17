<template>
    <teleport to="body">
        <div class="modal-overlay">
            <div class="container" style="width: 600px; height:550px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>강의 주차별 계획</span>
                            </p>
                        </div>
                        <div class="modal-body" style="width: 550px; height: 350px;">
                            <table class="table table-bordered">
                                <colgroup>
                                    <col width="20%">
                                    <col width="80%">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th class="table-active t-header">주차수</th>
                                        <td>
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                v-model="dataDetail.week" disabled 
                                                v-if="dataDetail.lec_id"
                                            />
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                v-model="dataDetail.week" 
                                                v-else
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="table-active t-header">학습 목표</th>
                                        <textarea
                                            type="text"
                                            class="form-control"
                                            v-model="dataDetail.learn_goal"
                                            rows="3"
                                        />
                                    </tr>
                                    <tr>
                                        <th class="table-active t-header">학습 내용</th>
                                        <textarea
                                            type="text"
                                            class="form-control"
                                            v-model="dataDetail.learn_con"
                                            rows="6"
                                        />
                                    </tr>
                                </tbody>
                            </table>                            
                        </div>
                        <div class="modal-footer">
                            <button 
                                type="button" 
                                class="btn btn-info me-2" 
                                @click="postWeekPlanDetail" 
                                v-if="!dataDetail.week">등록</button>
                            <template v-else>
                                <button 
                                    type="button" 
                                    class="btn btn-info" 
                                    @click="postWeekPlanDetail">수정</button>
                                <button 
                                    type="button" 
                                    class="btn btn-info mx-2" 
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
import { onMounted, ref } from 'vue';
import { axiosAction } from '.';
import { Tut } from '@/api/api';

const props = defineProps({
    lectureId: Number,
    weekPlan: Object,
});
const updateHandler = ref(props.weekPlan ? 'U' : 'I');
const emit = defineEmits(['closeAndSearch']);

const lectureId = ref(0);
const dataDetail = ref(new Object);


// 강의 주간계획 저장(등록, 수정)
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

// 강의 주간계획 삭제
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

onMounted(() => {
    props.lectureId? lectureId.value = props.lectureId : null;
    props.weekPlan ? dataDetail.value = props.weekPlan : null;

    // console.log("ModalWeekPlan> props.weekPlan: " + JSON.stringify(dataDetail.value));
    // console.log("ModalWeekPlan> props.lectureId : " + lectureId.value);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
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
