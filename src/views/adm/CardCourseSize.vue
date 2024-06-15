<template>
    <div class="col-sm-4">
        <div class="card">
            <!-- {"totalCnt": 27,
                "lecList": [{"lec_id": 1,"tutor_id": null,"lec_name": "자바의이해","max_pnum": 51,"pre_pnum": 0,
                        "start_date": "2024.03.05","end_date": "2024.06.15","process_day": null,"test_id": 0,
                        "loginID": null,"user_type": null,"use_yn": null,"name": "스티븐잡스","std_id": null,
                        "test_score": 0,"tot_score": 286,"max_score": 100,"min_score": 43,"avg_score": 71,
                        "fail_cnt": 2,"fail_rate": 0.0}],"pageSize": 6,"currentPage": 1} -->
            <div class="card-body">
                <h5 class="card-title">
                    {{ data.lec_name }}
                </h5>
                <table class="table">
                    <tbody>
                        <tr>
                            <th>강사명</th>
                            <td>{{ data.name }}</td>
                        </tr>
                        <tr>
                            <th>기간</th>
                            <td>{{ data. start_date}} ~ {{ data. end_date}}</td>
                        </tr>
                        <tr>
                            <td>수강인원</td>
                            <td>{{ data.pre_pnum }}</td>
                        </tr>
                    </tbody>
                </table>
                <button class="btn btn-outline-primary btn-sm"
                        @click="modalHandler(data)"
                        >상세보기</button>
            </div>
        </div>
        <ModalCouseSize
            v-if="modalBoolean"
            :data="data"
            @closeModal="modalBoolean = $event"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ModalCouseSize from './ModalCouseSize.vue';

defineProps({
    data: Object,
});
const modalBoolean = ref(false);
const detailData = ref();

const modalHandler = (param) => {
    console.log("CardCourseSize modalHandler> param: " + JSON.stringify(param));
    modalBoolean.value = true;
    detailData.value = param;
};
</script>

<style>
.col-sm-4 {
    margin-bottom: 10px;
}
.card {
    width: 100%;
    min-height: 250px;
}
.card-title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
}
.btn-sm {
    /* float: right; */
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>
