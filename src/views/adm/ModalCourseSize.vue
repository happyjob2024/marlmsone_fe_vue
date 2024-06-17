<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container">
                <div class="modal-dialog">
                    <div class="modal-content" >
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>수강인원 상세보기</span>
                            </p>
                        </div>
                        <div class="modal-body" style="width: 500px; height: 550px;">
                            <!-- {"totalCnt": 27,
                                "lecList": [{"lec_id": 1,"tutor_id": null,"lec_name": "자바의이해","max_pnum": 51,"pre_pnum": 0,
                                    "start_date": "2024.03.05","end_date": "2024.06.15","process_day": null,"test_id": 0,
                                    "loginID": null,"user_type": null,"use_yn": null,"name": "스티븐잡스","std_id": null,
                                    "test_score": 0,"tot_score": 286,"max_score": 100,"min_score": 43,"avg_score": 71,
                                    "fail_cnt": 2,"fail_rate": 0.0}],"pageSize": 6,"currentPage": 1} -->
                            <table class="table table-bordered" >
                                <colgroup>
                                    <col width="25%">
                                    <col width="25%">
                                    <col width="25%">
                                    <col width="25%">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th class="t-header table-active">강의명</th>
                                        <td colspan="3">{{ data.lec_name }}</td>
                                    </tr>
                                    <tr>
                                        <th class="t-header table-active">강사명</th>
                                        <td colspan="3">{{ data.name }}</td>
                                    </tr>
                                    <tr>
                                        <th class="t-header table-active">기간</th>
                                        <td colspan="3">{{ data. start_date}} ~ {{ data. end_date}}</td>
                                    </tr>
                                    <tr>
                                        <td class="t-header table-active">수강인원</td>
                                        <td>{{ data.pre_pnum }}</td>
                                        <td class="t-header table-active">과락인원</td>
                                        <td>{{ data.fail_cnt }}</td>
                                    </tr>
                                    <tr>
                                        <td class="t-header table-active">총점수</td>
                                        <td>{{ data.tot_score }}</td>
                                        <td class="t-header table-active">평균</td>
                                        <td>{{ data.avg_score }}</td>
                                    </tr>
                                    <tr>
                                        <td class="t-header table-active">최대점수</td>
                                        <td>{{ data.max_score }}</td>
                                        <td class="t-header table-active">최소점수</td>
                                        <td>{{ data.min_score }}</td>
                                    </tr>                                    
                                </tbody>
                            </table>
                            <BarChart 
                                :lectureName="data.lec_name"
                                :maxPnum="data.max_pnum" 
                                :prePnum="data.pre_pnum"
                                :failCnt="data.fail_cnt"/>
                        </div>
                        <div class="modal-footer">
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
import { onMounted } from 'vue';
import BarChart from './BarChart.vue';

const props = defineProps({
    data: Object,
});

onMounted(() => {
    console.log("ModalCourseSize> props.data : " + JSON.stringify(props.data));
});

</script>

<style>
.t-header {
    font-weight: bold;
}
</style>