<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container" style="width: 800px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>수강목록 상세보기</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <span class="input-group-text">강의명</span>
                                <input type="text" class="form-control" :value="dataList.lec_name" readonly/>
                                <span class="input-group-text">강의분류</span>
                                <input type="text" class="form-control" :value="dataList.lec_type_name" readonly/>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">강사명</span>
                                <input type="text" class="form-control" :value="dataList.tut_name" readonly/>
                                <span class="input-group-text">강의실</span>
                                <input type="text" class="form-control" :value="dataList.lecrm_name" readonly/>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">강의기간</span>
                                <input type="text" class="form-control" :value="dataList.start_date + ' ~ ' + dataList.end_date" readonly/>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">수업목표</span>
                                <textarea type="text" class="form-control" :value="dataList.lec_goal" readonly/>
                            </div>
                            <template v-if="dataList.week !== null">
                                <div class="input-group mb-3">
                                    <template v-for="data, i in weekList" :key="i">
                                        <div class="top-div">
                                            <span>{{ data.week }}</span>
                                        </div>
                                        <div class="second-div">
                                            <div class="div-child" style="border-bottom: 1px solid white;">
                                                <span>학습목표</span>
                                            </div>
                                            <div class="div-child">
                                                <span>학습내용</span>
                                            </div>
                                        </div>
                                        <div class="third-div">
                                            <div>
                                                <input type="text" class="form-control" :value="data.learn_goal"/>
                                            </div>
                                            <div>
                                                <input type="text" class="form-control" :value="data.learn_con"/>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </div>
                        <div class="modal-footer" style="margin-top: 20px;">
                            <button type="button" class="btn btn-light" @click="$emit('closeModal', false)">
                                확인
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
import { onMounted, ref } from 'vue';

    const props = defineProps({
        lecture_id: Number
    });
    const dataList = ref(new Object());
    const weekList = ref([]);
    const listCount = ref(0);

    const getLectureDetail = () => {
        let param = new URLSearchParams();
        param.append('lec_id', props.lecture_id);

        axios.post('/std/myLectureDetail.do', param).then((res) => {
            dataList.value = res.data.listData[0];
            listCount.value = res.data.listCnt;
            weekList.value = res.data.listData;
        });
    };

    onMounted(() => {
        getLectureDetail();
    });

</script>

<style>

    .container{
        height: fit-content
    }

    .top-div {
        width: 25%;
        background-color: lightgray;
        display: flex;
        justify-content: center; 
        align-items: center;
        border: 1px solid white;
    }

    .second-div {
        width: 25%;
        background-color: lightgray;
        border: 1px solid white;
        display: flex;
        flex-direction: column;
    }

    .div-child {
        justify-content: center; 
        text-align: center;
        flex: 1;
        margin-top: 7px;
    }
        
    .third-div {
        width: 50%;
    }
</style>