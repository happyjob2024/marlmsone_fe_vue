<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container rounded-4 shadow">
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
                                        <span class="input-group-text">시험명</span>
                                        <input type="text" class="form-control" v-model="testData.test_name" disabled />
                                    </div>
                                </div>
                            </div>
                            <div v-for="(data, i) in testDetail" :key="i">
                                <div class="row mb-2">
                                    <div class="col-12">
                                        <div class="text-center ">
                                            <hr />
                                            <p>시험문제</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-12">
                                        <div>
                                            <p>{{ data.test_que }}</p>
                                        </div>
                                        <hr />
                                        <div>
                                            <p>1. {{ data.que_ex1 }}</p>
                                            <p>2. {{ data.que_ex2 }}</p>
                                            <p>3. {{ data.que_ex3 }}</p>
                                            <p>4. {{ data.que_ex4 }}</p>
                                        </div>
                                        <div>
                                            <p style="color: red">정답 {{ data.que_ans }}번</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info" @click="$emit('closeModal', false)">확인</button>
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

let testDetail = ref([]);

const props = defineProps({
    testData: Object,
});

const fViewTestDetail = () => {
    let param = new URLSearchParams(props.testData);

    axios.post('/tut/tutTestJsonDetail.do', param).then((res) => {
        testDetail.value = res.data.listdata;
    });
}


onMounted(() => {
    fViewTestDetail();
});

</script>

<style>
.container {
    height: 95vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-body {
    max-height: 75vh;
    width: 70vw;
    overflow-y: auto;
}
</style>
