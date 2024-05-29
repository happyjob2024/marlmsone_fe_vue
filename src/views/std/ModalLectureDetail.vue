<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container" style="width: 800px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>강의정보</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <span class="input-group-text">강의명</span>
                                <input type="text" class="form-control" v-model="lectureInfo.lec_name" />
                                <span class="input-group-text">수강대상</span>
                                <input type="text" class="form-control" v-model="lectureInfo.lec_sort" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">강사명</span>
                                <input type="text" class="form-control" v-model="lectureInfo.name" />
                                <span class="input-group-text">연락처</span>
                                <input type="text" class="form-control" v-model="lectureInfo.tel" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">이메일</span>
                                <input type="text" class="form-control" v-model="lectureInfo.mail" />
                                <span class="input-group-text">강의실</span>
                                <input type="text" class="form-control" v-model="lectureInfo.lecrm_id" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">수업목표</span>
                                <textarea type="text" class="form-control" v-model="lectureInfo.lec_goal" />
                            </div>
                        </div>

                        <div class="modal-header">
                            <p class="conTitle">
                                <span>강의계획</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <div class="lecPlan_Head">
                                <div class="input-group-text lecPlan_Head_Child">주차수</div>
                                <div class="input-group-text lecPlan_Head_Child">학습목표</div>
                                <div class="input-group-text lecPlan_Head_Child">학습내용</div>
                            </div>
                            <div class="lecPlan_Body" v-for="(data, i) in weekInfo" :key="i">
                                <span class="input-group-text lecPlan_Body_Child">{{ data.week }}</span>
                                <span class="input-group-text lecPlan_Body_Child">{{ data.learn_goal }}</span>
                                <span class="input-group-text lecPlan_Body_Child">{{ data.learn_con }}</span>
                            </div>
                            
                        </div>

                        <div class="modal-footer" style="margin-top: 20px;">
                            <button type="button" class="btn btn-info" @click="insertCourseEnrollment">
                                수강신청
                            </button>
                            <button type="button" class="btn btn-light" @click="$emit('closeModal', false)">
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import axios from 'axios';
import { inject, onMounted, ref } from 'vue';

    const injectTest = inject('test');
    console.log('injectTest',injectTest)

    const props = defineProps({
        lecture_id: Number
    });
    const lectureInfo = ref(new Object());
    const weekInfo = ref(new Object());
    const emit = defineEmits(['closeModal']);

    const getLectureDetail = () => {
        let param = new URLSearchParams();
        param.append('lec_id', props.lecture_id);

        axios.post('/std/lecInfo.do', param).then((res) => {
            lectureInfo.value = res.data.lecInfo;
            weekInfo.value = res.data.week_plan;
        })
    };

    const insertCourseEnrollment = () => {
        let param = new URLSearchParams();
        param.append('lec_id', props.lecture_id);

        axios.post('/std/lecReg.do', param).then((res) => {
            if(res.data.result === 'SUCCESS'){
                alert(res.data.resultMsg);
                emit('closeModal', false);
                injectTest();
            }
        });
    }

    onMounted(() => {
        props.lecture_id ? getLectureDetail() : null;
        
    });

</script>

<style scoped>

    .container{
        height: fit-content
    }

    .lecPlan_Head {
        display: flex;
        width: 100%;
    }

    .lecPlan_Head_Child {
        justify-content: center;
        width: 100%;
    }

    .lecPlan_Body {
        display: flex;
        width: 100%;
    }

    .lecPlan_Body_Child {
        justify-content: center;
        width: 100%;
        background-color: white;
    }
    
</style>