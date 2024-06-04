<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container rounded-4 shadow" style="width: 800px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>시험문제 출제</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-2">
                                <div class="col-6">
                                    <div class="input-group">
                                        <span class="input-group-text">강의명</span>
                                        <input type="text" class="form-control" v-model="testData.lec_name" disabled />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="input-group">
                                        <span class="input-group-text">강의분류</span>
                                        <input type="text" class="form-control" v-model="testData.lec_type_name"
                                            disabled />
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-6">
                                    <div class="input-group">
                                        <span class="input-group-text">시험명</span>
                                        <input type="text" class="form-control" v-model="testData.test_name" />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="input-group">
                                        <span class="input-group-text">문항 수</span>
                                        <input type="text" class="form-control" v-model="testData.generate_cnt" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <div class="input-group">
                                    <span class="input-group-text">시험 시작일</span>
                                    <input type="date" class="form-control" v-model="beforeStartDate" />
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="input-group">
                                    <span class="input-group-text">시험 종료일</span>
                                    <input type="date" class="form-control" v-model="beforeEndDate" />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info" @click="fGenerateTest(testData)">시험지 생성</button>
                            <button type="button" class="btn btn-light" @click="modalClear(testData)">취소</button>
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
    testData: Object,
});

const emit = defineEmits(['closeAndGenerate']);
const beforeStartDate = ref('');
const beforeEndDate = ref('')

const fGenerateTest = (testData) => {
    testData.test_start = beforeStartDate.value.replace(/-/g, '.');
    testData.test_end = beforeEndDate.value.replace(/-/g, '.');

    let param = new URLSearchParams(testData);

    axios.post('/tut/generateTest.do', param).then((res) => {
        if (res.data.result === 'SUCCESS') {
            alert(res.data.resultMsg);
            emit('closeAndGenerate', false);
        }
    }).catch((error) => {
        alert('잘못된 입력입니다.');
        testData.test_name = '';
        testData.generate_cnt = '';
        beforeStartDate.value = '';
        beforeEndDate.value = '';
    });
}

const modalClear = (testData) => {
    testData.test_name = '';
    testData.generate_cnt = '';
    beforeStartDate.value = '';
    beforeEndDate.value = '';
    emit('closeModal', false)
};

onMounted(() => {
});

</script>

<style></style>
