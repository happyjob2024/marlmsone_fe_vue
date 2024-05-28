<template>
  <div>
    <teleport to="body">
      <div class="backdrop">
        <div class="container" style="width: 500px">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <p class="conTitle">
                  <span v-if="modalProps">상세정보</span>
                  <span v-if="!modalProps">등록</span>
                </p>
              </div>
              <div class="modal-body">
                <div class="input-group mb-3">
                  <span class="input-group-text">제목</span>
                  <input type="text" class="form-control" v-model="noticeData.notice_tit"/>
                </div>
                <div class="input-group mb-3" v-if="modalProps">
                  <span class="input-group-text">로그인 아이디</span>
                  <input type="text" 
                         class="form-control" disabled
                         v-model="this.userInfo.loginId"/>
                  <input type="text" class="form-control" disabled />
                </div>
                <div class="input-group mb-3" v-show="detailProps">
                  <span class="input-group-text">작성자</span>
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    v-model="noticeData.name"
                  />
                </div>
                <div class="input-group mb-3" style="min-height: 200px">
                  <span class="input-group-text">내용</span>
                  <textarea
                    style="resize: none"
                    class="form-control"
                    v-model="noticeData.notice_con"
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-info"
                  @click="insertNoticeDetail"
                  v-show="!modalProps"
                >
                  등록
                </button>
                <button
                  type="button"
                  class="btn btn-info"
                  @click="updateNoticeDetail"
                  v-show="modalProps"
                >
                  수정
                </button>
                <button
                  type="button"
                  class="btn btn-info"
                  @click="deleteNoticeDetail"
                  v-show="modalProps"
                >
                  삭제
                </button>
                <button
                  type="button"
                  class="btn btn-light"
                  @click="$emit('closeModal', false)"
                >
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
import axios from "axios";

export default {
  props: ["getNoticeList", "modalProps", "currengPage"],
  data() {
    return {
      noticeData: {},
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
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
