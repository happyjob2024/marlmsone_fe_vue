<template>
    <div>
        <div>
            <span>댓글</span>
        </div>
        <div style="display: flex; align-items: center;">
            <input 
                type="text" 
                class="form-control" 
                v-model="inputComment"
            />
            <button v-if="!isUpdate" class="btn btn-primary" @click="insertComment">등록</button>
            <button v-else class="btn btn-primary" @click="finalupdateComment">수정</button>
        </div>

        <template v-for="comment, i in commentInfo" :key="i">
            <div class="row">
                <div class="col">
                    <div class="row">
                        <div class="col-2 commentNo">
                            <span>{{ i+1 }}</span>
                        </div>
                        <div class="col">
                            <div class="row">
                                <div class="col">
                                    <span>{{ comment.loginID }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <span>{{ comment.rv_con }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-3 mt-2">
                            <div class="row">
                                <div class="col-5">
                                    <span>{{ comment.regdate }}</span>
                                </div>
                                <template v-if="loginInfo.loginId === comment.loginID">
                                    <div class="col">
                                        <button type="button" @click="updateComment(comment)">
                                            수정
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button type="button" @click="deleteComment(comment.rv_id)">
                                            삭제
                                        </button>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useStore } from 'vuex';

    const props = defineProps({
        qna_id: Number,
        commentInfo: Array
    });
    const inputComment = ref('');
    const emit = defineEmits(['getQnADetail']);
    const store = useStore();
    const loginInfo = store.getters.getLoginInfo;
    const isUpdate = ref(false);
    const updateCommentId = ref(null);

    const insertComment = () => {
        let param = new URLSearchParams();
        param.append('qna_id', props.qna_id);
        param.append('rv_con', inputComment.value);

        axios.post('/commentSave.do', param).then((res) => {
            alert(res.data.msg);
            emit('getQnADetail');
            inputComment.value = '';
        });
    };

    const updateComment = (comment) => {
        inputComment.value = comment.rv_con;
        isUpdate.value = true;
        updateCommentId.value = comment.rv_id;
    };

    const finalupdateComment = () => {
        let param = new URLSearchParams();
        param.append('rv_con', inputComment.value);
        param.append('rv_id', updateCommentId.value);

        axios.post('/commentModify.do', param).then((res) => {
            alert(res.data.msg);
            emit('getQnADetail');
            isUpdate.value = false;
            inputComment.value = '';
        });
    };

    const deleteComment = (event) => {
        let param = new URLSearchParams();
        param.append('rv_id', event);

        axios.post('/commentDelete.do', param).then((res) => {
            alert(res.data.msg);
            emit('getQnADetail');
        });
    };

</script>

<style>
    .commentNo {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>