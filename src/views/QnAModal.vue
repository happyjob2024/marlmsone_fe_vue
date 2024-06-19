<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container" style="height: 400px; width: 100%">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div>
                                <p class="conTitle">
                                    <span>Q&A</span>
                                </p>
                            </div>
                            <div v-if="loginInfo.loginId == qnaInfo.loginID">
                                <button class="btn btn-primary" @click="updateQnADetail">수정</button>
                                <button class="btn btn-danger" @click="deleteQnADetail">삭제</button>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3" >
                                <span class="input-group-text">제목</span>
                                <input 
                                    type="text" 
                                    class="form-control"
                                    v-model="qnaInfo.qna_title"
                                />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">내용</span>
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="qnaInfo.qna_con"
                                />
                            </div>
                        </div>

                        <template v-if="qna_id">
                            <QnAComment :qna_id="qna_id" :commentInfo="commentInfo" @getQnADetail="getQnADetail"/>
                        </template>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" v-if="!props.qna_id" @click="insertQnAInfo">
                                등록
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
import QnAComment from './QnAComment.vue';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

    const props = defineProps({
        qna_id: Number
    });
    const qnaInfo = ref([]);
    const commentInfo = ref([]);
    const emit = defineEmits(['closeModal', 'getQnAList']);
    const store = useStore();
    const loginInfo = store.getters.getLoginInfo;

    const getQnADetail = () => {
        let param = new URLSearchParams();
        param.append('qna_id', props.qna_id);

        axios.post('/qnaDetailView.do', param).then((res) => {
            qnaInfo.value = res.data.vo;
            commentInfo.value = res.data.commentData;
        });
    };

    const insertQnAInfo = () => {
        let param = new URLSearchParams();
        param.append('qna_title', qnaInfo.value.qna_title);
        param.append('qna_con', qnaInfo.value.qna_con);

        axios.post('/qnaSave.do', param).then((res) => {
            alert(res.data.msg);
            emit('closeModal', false);
            emit('getQnAList');
        });
    };

    const updateQnADetail = () => {
        let param = new URLSearchParams();
        param.append('qna_title', qnaInfo.value.qna_title);
        param.append('qna_con', qnaInfo.value.qna_con);
        param.append('qna_id', props.qna_id);

        axios.post('/qnaModify.do', param).then((res) => {
            alert(res.data.msg);
            emit('closeModal', false);
            emit('getQnAList');
        });
    };

    const deleteQnADetail = () => {
        let param = new URLSearchParams();
        param.append('qna_id', props.qna_id);

        axios.post('/qnaDelete.do', param).then((res) => {
            alert(res.data.msg);
            emit('closeModal', false);
            emit('getQnAList');
        });
    };

    onMounted(() => {
        props.qna_id ? getQnADetail() : null
    });

</script>

<style>
.backdrop {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 100px;
    background: rgba(255, 255, 255, 0.5);
}
.container {
    background: white;
    padding: 1.5rem;
    height: 100%;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
