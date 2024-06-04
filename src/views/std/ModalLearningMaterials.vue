<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container" style="width: 800px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>학습자료</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <span class="input-group-text">제목</span>
                                <input type="text" class="form-control" v-model="materialInfo.learn_tit" readonly/>
                                <span class="input-group-text">등록일자</span>
                                <input type="text" class="form-control" v-model="materialInfo.w_date" readonly/>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">내용</span>
                                <textarea class="form-control" v-model="materialInfo.learn_con" readonly></textarea>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">첨부파일</span>
                                <input type="text" class="form-control" v-model="materialInfo.learn_fname" readonly/>
                            </div>
                        </div>

                        <div class="modal-footer" style="margin-top: 20px;">
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
import { onMounted, ref } from 'vue';

    const props = defineProps({
        learn_data_id: Number
    });
    const materialInfo = ref([]);

    const stdLearnMatDetail = () => {
        let param = new URLSearchParams();
        param.append('learn_data_id', props.learn_data_id);

        axios.post('/std/stdLearnMatDetail.do', param).then((res) => {
            materialInfo.value = res.data.std_detail;
        });
    };

    onMounted(() => {
        stdLearnMatDetail();
    })

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