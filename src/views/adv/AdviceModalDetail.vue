<template>
    <div>
        <teleport to="body">
            <div class="backdrop">
                <div class="container" style="width: 600px">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <p class="conTitle">
                                    <span>수강 상담 관리 </span>
                                </p>
                            </div>
                            <div >
                                <div class="input-group mb-3">
                                    <span class="input-group-text">과정명</span>
                                    <input class="form-control" type="text" readonly v-bind:value="advProps.lec_name" />
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">학생 명</span>
                                    <input class="form-control" type="text" readonly v-bind:value="stdNameId"/> <!--홍길동(id) 형식으로 출력해야 함-->
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">상담 일자</span>
                                    <Datepicker 
                                        v-model="picked"
                                        :inputFormat="inputFormat"
                                        :locale="locale"
                                    />
                                    <span class="input-group-text">상담 장소</span>
                                    <input type="text" class="form-control" v-model="advProps.adv_place"/>
                                </div>
                                <div class="input-group mb-3">
                                    <sapn class="input-group-text">최종 수정 일자</sapn>
                                    <input type="text" class="form-control" readonly v-model="advProps.mod_date" />
                                    <sapn class="input-group-text">상담자</sapn>
                                    <input type="text" class="form-control" readonly v-model="advProps.tut_name" />
                                </div>
                                <div style="min-width: 200px">
                                    <span class="input-group-text">상담 내용</span>
                                    <QuillEditor v-model="advProps.adv_content"/>
                                    
                            
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-info" v-on:click="updateAdvice">저장</button>
                                <button type="button" v-show="this.userInfo.userType != 'C'"  class="btn btn-info" v-on:click="deleteAdvice">삭제</button>
                                <button type="button" class="btn btn-light" @click="this.$emit('closeModal',false)">
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
import Datepicker from 'vue3-datepicker';
import { ref, reactive, defineComponent } from 'vue';
import { ko } from 'date-fns/locale';
import axios from 'axios';
import QuillEditor from './QuillEditor.vue';


export default {
    props: ['advProps'],
    date() {
        return {}
    },
    components: {
        Datepicker,QuillEditor
    },
    setup(props) {
        const picked = ref(new Date(props.advProps.adv_date));
        const locale = reactive(ko);
        const inputFormat = ref('yyyy-MM.dd');   
        

        return {
            picked,
            locale,
            inputFormat,
        }
    },
    methods: {
        updateAdvice() {
            let param = new URLSearchParams();
            let date = this.formatDate(this.picked); //format 함수가 두 번 구현 됨
            param.append('action', 'U');
            param.append('lec_id', this.advProps.lec_id);
            param.append('std_id', this.advProps.std_id);
            param.append('adv_place', this.advProps.adv_place);
            param.append('adv_content', this.advProps.adv_content);
            param.append('adv_date', date);
            param.append('adv_id', this.advProps.adv_id);
            axios.post('/adv/advSave.do', param).then((res) => {
                this.$emit('closeModal');
                this.$emit('saveAndReload');
            })
        },
        deleteAdvice() {
            let param = new URLSearchParams();
            param.append('action', 'U');
            param.append('adv_id', this.advProps.adv_id);
            axios.post('/adv/advDelete.do', param).then((res) => {
                this.$emit('closeModal');
                this.$emit('saveAndReload');
            })
        },
        formatDate(picked) {
            const now = picked;
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.getLoginInfo;
        },
        stdNameId() {
            return `${this.advProps.std_name}(${this.advProps.std_id})`;
        }
    }
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
