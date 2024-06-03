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
                          <!-- <input type="hidden" id="action" name="action" v-model="lecData.action" />  -->
                            <div class="input-group mb-3">
                                <span class="input-group-text">강의 명</span>
                                <input type="text" class="form-control" v-model="lecData.lec_name" />
                            </div>
                            <tr>
								<th scope="row">강의 분류</th>
								<td colspan="3">
                  <select class="inputTxt p100" name="lec_type_id" id="lec_type_id" v-model="lecData.lec_type_id" >
									<option value="" id="">강의 분류 선택</option>
									<option v-for="(list, i) in typeList" :key="i">{{ list.lec_type_name }}</option>
								</select></td>
							</tr>

                            <!-- <div class="input-group mb-3">
                                <span class="input-group-text">강의 분류</span>
                                <input type="text" class="form-control"  />
                            </div> -->
                            <div class="input-group mb-3">
                                <span class="input-group-text">최대인원</span>
                                <input type="text" class="form-control" v-model="lecData.max_pnum"/>
                            </div>
                            <!-- <div class="input-group mb-3">
                                <span class="input-group-text" >강사명</span>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="lecData.tutor_id"
                                />
                            </div> -->
                            <tr>
								<th scope="row">강사 명</th>
								<td colspan="3">
                  <select class="inputTxt p100" name="tutor_id" id="tutor_id" v-model="lecData.tutor_id" >
									<option value="" id="">강사 선택</option>
									<option v-for="(list, i) in tutList" :key="i">{{ list.t_name }}</option>
								</select></td>
							</tr>

                            <!-- <div class="input-group mb-3">
                                <span class="input-group-text">강의실 선택</span>
                                <input type="text" class="form-control"  v-model="lecData.lecrm_id"/>
                            </div> -->
                            <tr>
								<th scope="row">강의실 선택</th>
								<td colspan="3">
                  <select class="inputTxt p100" name="lecrm_name" id="lecrm_name" v-model="lecData.lecrm_name" >
									<option value="" id="">강의실 선택</option>
									<option v-for="(list, i) in lecrmList" :key="i">{{ list.lecrm_name }}</option>
								</select></td>
							</tr>
                            <div class="input-group mb-3">
                                <span class="input-group-text">과정일수</span>
                                <input type="text" class="form-control" v-model="lecData.process_day"/>
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">개강일</span>
                                <input type="date" class="form-control" v-model="lecData.start_date" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">종강일</span>
                                <input type="date" class="form-control" v-model="lecData.end_date"/>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info" @click="insertRegisterDetail" v-show="!modalProps.lecId">
                                등록
                            </button>
                                <button type="button" class="btn btn-info" @click="updateRegisterDetail" v-show="modalProps.lecId">수정</button>
                                <button type="button" class="btn btn-info" @click="deleteEquimentDetail">삭제</button>
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
        typeList: [],
        action: 'I'
      };
    },
    // computed: {
    //   userInfo() {
    //     return this.$store.getters.getLoginInfo;
    //   },
    // },
    methods: {
      insertRegisterDetail() {
        let param = new URLSearchParams(this.lecdata);
        // param.append("loginID", this.userInfo.loginId);
        
        axios.post("/register/saveRegister.do", param).then((res) => {
          if (res.data.result === "s") {
            alert(res.data.msg);
            this.$emit("closeModal", false);
            this.getNoticeList();
          }
        });
      },
      getRegisterDetail() {
        let param = new URLSearchParams();
        param.append("register_id", this.modalProps.lecId);
  
        console.log("getRegisterDetail 호출됨, register_id:", this.modalProps);
        if(this.modalProps.lecId) {
          this.action = "U"
          axios.post("/register/lecInfo.do", param).then((res) => {
            this.lecData = res.data.lecinfo;
            console.log("lecData:", this.lecData, res.data);
          });
        }

        axios.post("/register/registerListControljson.do", param).then((res) => {
          console.log("서버 응답 데이터:", res.data);
          this.lecrmList = res.data.lecrmList;
          this.tutList = res.data.tutList;
          this.typeList = res.data.typeList;
          console.log("타입리스트 : " + this.typeList)
        });
      },
      
      updateRegisterDetail() {
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
      console.log("mounted 호출됨, modalProps:", this.modalProps);
      this.modalProps ? this.getRegisterDetail() : null;
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
  