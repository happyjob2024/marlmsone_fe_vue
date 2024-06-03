<template>
    <div>
        <teleport to="body">
            <div class="backdrop">
                <div class="container" style="width: 500px">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <p class="conTitle">
                                    <span>상세정보</span>
                                </p>
                            </div>
                            <div class="modal-body">
                                <div class="input-group mb-3" >
                                    <span class="input-group-text">제목</span>
                                    <p v-show="false">{{ noticeData= this.selInfo }}</p>
                                    <input type="text" class="form-control" v-model="noticeData.notice_tit"   /> 
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">로그인 아이디</span>
                                    <input type="text" class="form-control" disabled v-model="this.userInfo.loginId"/>
                                </div>
                                <div class="input-group mb-3" v-show="detailProps">
                                    <span class="input-group-text">작성자</span>
                                    <input type="text" class="form-control" disabled v-model="selInfo.name"/>
                                </div>
                                <div class="input-group mb-3" style="min-height: 200px">
                                    <span class="input-group-text">내용</span>
                                    <textarea style="resize: none" class="form-control" v-model="selInfo.notice_con"/>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-info" v-show="!selInfo.notice_id" @click="insertNoticeDetail">등록</button>
                                <button type="button" class="btn btn-info" v-show="(noticeData.loginID == userInfo.loginId) || (userType == 'C' && noticeData.loginID) " @click="updateNoticeDetail">수정</button>
                                <button type="button" class="btn btn-info" v-show="(noticeData.loginID == userInfo.loginId) || (userType == 'C' && noticeData.loginID)" @click="deleteNoticeDetail">삭제</button>
                                <button type="button" class="btn btn-light" @click="this.$emit('closeModal', false)">
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: ['functionProps', 'selInfo', 'userType'],
    data() {
        return {
            noticeData: {}
        };
    },  
    computed: {
        userInfo() {
            return this.$store.getters.getLoginInfo;
        },
    },
    methods: {
        insertNoticeDetail() {
            let param = new URLSearchParams();
            param.append('loginId', this.userInfo.loginId);
            param.append('notice_tit', this.noticeData.notice_tit);  //this.를 붙여줘야 접근이 된다...이유가 뭘까
            param.append('notice_con', this.noticeData.notice_con);

            axios.post('/notice/noticeSave.do', param).
                then((res) => {
                    if (res.data.result === 'success') {
                        alert(res.data.msg);
                        this.$emit('closeAndreload');
                    }
                });
            
        },
        updateNoticeDetail() {
            let param = new URLSearchParams();
            param.append('noticeNo', this.selInfo.notice_id);
            param.append('notice_tit', this.selInfo.notice_tit);
            param.append('notice_con', this.selInfo.notice_con);
            axios.post('/notice/noticeModify.do', param).
                then((res) => {
                    if (res.data.result === 'success') {
                        alert(res.data.msg);
                        this.$emit('closeAndreload');
                    }
                });
        },
        deleteNoticeDetail() {
            let param = new URLSearchParams();
            param.append('noticeNo', this.selInfo.notice_id);
            axios.post('/notice/noticeDelete.do', param).then((res) => {
                if (res.data.success == true) {
                    alert(res.data.msg);
                    this.$emit('closeAndreload');
                } else {
                    alert(res.data.msg);
                }
            });
        },
    }
};
</script>

<style>
.backdrop {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
}
.container {
    background: white;
    padding: 1.5rem;
    height: 70%;
}
</style>