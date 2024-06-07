<template>
  <div>
    <teleport to="body">
      <div class="backdrop">
        <div class="container" style="width: 500px">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <p class="conTitle">
                  <span>수강 상담 관리 </span>
                </p>
              </div>
              <div >
                <div class="input-group mb-3">
                  <span class="input-group-text">과정 명</span>
                  <select v-model="this.newAdv.lec_name"  @change="getStdList" class="form-control">
                    <option>
                      과정 명 선택
                    </option>
                    <option v-for="(list, i) in lecProps" :key="i" :value="list.lec_id" >
                      {{list.lec_name }}
                    </option>
                  </select>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">학생 명</span>
                  <select v-model="this.newAdv.std_id" class="form-control">
                    <option> 학생 명 선택</option>
                    <option v-for="(list, i) in studentList" :key="i" :value="list.std_id" >
                      {{ list.std_name }}
                    </option>
                  </select>
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">상담 일자</span>
                  <Datepicker
                    v-model="picked"                 
                    :inputFormat="inputFormat"
                    :locale="locale"
                  />
                  <span class="input-group-text">상담 장소</span>
                  <input v-model="this.newAdv.adv_place" type="text" class="form-control"/>
                </div>
                <div  style="min-width: 200px">
                  <span class="input-group-text">상담 내용</span>
                  <QuillEditor v-model="this.newAdv.adv_content"/>
                  
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-info" v-on:click="saveAdvice">저장</button>
                <button type="button" class="btn btn-light" @click="this.$emit('closeModal', false)">
                    취소
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
import Datepicker from 'vue3-datepicker'; //달력 패키지
import { ref, reactive, defineComponent } from 'vue';
import { ko } from 'date-fns/locale';
import QuillEditor from './QuillEditor.vue';

export default {
  props: ['lecProps','advProps'],
  data() {
    return {
      studentList: [...this.lecProps],
      newAdv: {},
    }
  },
  methods: {
    getStdList(event) {
      let param = new URLSearchParams();
      param.append('lec_id', event.target.value);
      axios.post('/adv/mlecStdList2.do', param).then((res) => {
        this.studentList = res.data.listData;
        this.newAdv.lec_id = event.target.value;
      })
    },
    saveAdvice() {
      let param = new URLSearchParams();
      let date = this.formatDate(this.picked)
      param.append('action','I');
      param.append('lec_id',this.newAdv.lec_id);
      param.append('std_id',this.newAdv.std_id);
      param.append('adv_place', this.newAdv.adv_place);
      param.append('adv_content',this.newAdv.adv_content);
      param.append('adv_date', date);
      param.append('tmp_lec_id','');
      axios.post('/adv/advSave.do', param).then((res) => {
        this.$emit('closeModal'); // 저장 후 모달 끄기
        this.$emit('saveAndReload'); // 모달 끄고 목록 최신화
      })
      
    },
    formatDate(picked) {
      const now = picked;
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  components: {
    Datepicker,QuillEditor
  },
  setup() {
    const picked = ref(new Date());
    const locale = reactive(ko);
    const inputFormat = ref('yyyy-MM.dd');   


    return {
      picked,
      locale,
      inputFormat,
    }
  },
}
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
