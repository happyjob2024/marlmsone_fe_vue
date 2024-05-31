<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container" style="width: 500px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>강의등록</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3">
                                <span class="input-group-text">강의 명</span>
                                <input type="text" class="form-control" v-model="LecData.lec_name" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">강의 분류</span>
                                <input type="text" class="form-control"  />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">최대인원</span>
                                <input type="text" class="form-control" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">강사명</span>
                                <input
                                    type="text"
                                    class="form-control"
                                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
                                   
                                />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">강의실 선택</span>
                                <input type="text" class="form-control"  />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">과정일수</span>
                                <input type="text" class="form-control"  />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">개강일</span>
                                <input type="text" class="form-control"  />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">종강일</span>
                                <input type="text" class="form-control" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info" @click="postEquipmentDetail" v-if="!equipId">
                                등록
                            </button>
                            <template v-else>
                                <button type="button" class="btn btn-info" @click="postEquipmentDetail">수정</button>
                                <button type="button" class="btn btn-info" @click="deleteEquimentDetail">삭제</button>
                            </template>
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
  
  <script>
  import axios from "axios";
  
  export default {
    props: ["getRegisterList", "modalProps", "currentPage"],
    data() {
      return {
        lecData: {},
        lecrmList: [],
        tutList: [],
        typeList: []
      };
    },
    // computed: {
    //   userInfo() {
    //     return this.$store.getters.getLoginInfo;
    //   },
    // },
    methods: {
      insertNoticeDetail() {
        let param = new URLSearchParams(this.noticeData);
        param.append("loginID", this.userInfo.loginId);
  
        axios.post("/notice/noticeSave.do", param).then((res) => {
          if (res.data.result === "success") {
            alert(res.data.msg);
            this.$emit("closeModal", false);
            this.getNoticeList();
          }
        });
      },
      getNoticeDetail() {
        let param = new URLSearchParams();
        param.append("notice_id", this.modalProps);
  
        axios.post("/notice/noticeView.do", param).then((res) => {
          this.noticeData = res.data.selinfo;
        });
      },
      updateNoticeDetail() {
        let param = new URLSearchParams(this.noticeData);
        axios.post("/notice/noticeModify.do", param).then((res) => {
          if (res.data.result === "success") {
            alert(res.data.msg);
            this.$emit("closeModal", false);
            this.getNoticeList(this.currengPage);
          }
        });
      },
      deleteNoticeDetail() {
        let param = new URLSearchParams();
        param.append("noticeNo", this.modalProps);
  
        axios.post("/notice/noticeDelete.do", param).then((res) => {
          if (res.data.success) {
            alert(res.data.msg);
            this.$emit("closeModal", false);
            this.getNoticeList();
          }
        });
      },
    },
    mounted() {
      this.modalProps ? this.getNoticeDetail() : null;
    },
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
  