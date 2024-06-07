<template>
    <div>
    <div id="advice">
        <p >
           <a href="/dashboard/home" class="btn_set home"></a>
           <span class="btn_nav bold">학습 관리</span>
           <span class="btn_nav bold">수강 상담 관리</span>
        </p>
        <p class="conTitle">
           <span>수강 상담 관리 </span>
           <span class="fr">
                <select v-model="lecId" @change="getAdvList()">
                    <option value="">
                        전체 과정 
                    </option>
                    <option v-for="(contants, i) in lecList" :key="i" :value="contants.lec_id">
                        <template v-if="contants.end_date > currentDate">
                            {{ '(진행중)' }}<span>{{" "}}</span>{{ contants.lec_name }}
                        </template>
                        <template v-else>
                            {{ '(종료)' }}<span>{{" "}}</span>{{ contants.lec_name }}
                        </template>
                    </option>
                        
                </select>
                <a class="btn btn-primary mx-2" style="margin-left: 10px">
                    <span @click="openModal('new')">상담 등록</span>
                </a>
           </span>
        </p>
    </div>
        
    <div>
        <table class="col">
            <caption></caption>
            <colgroup>
                <col width="10%" />
                <col width="30%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">상담 번호</th>
                    <th scope="col">과정 명</th>
                    <th scope="col">학생 명(ID)</th>
                    <th scope="col">상담 일자</th>
                    <th scope="col">상담자 명(ID)</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="true">
                    <tr v-for="(contants , i) in advList" :key="i">
                        <td :data-adv-id="contants.adv_id" @click="getDetail($event)" >{{ contants.adv_id}}</td>
                        <td>{{ contants.lec_name}}</td>
                        <td v-bind:data-adv-id="contants.adv_id" @click="getDetail($event)">{{ contants.std_id}}</td>
                        <td>{{ contants.adv_date}}</td>
                        <td>{{ contants.tut_id}}</td>
                    </tr>
                </template>
            </tbody>
        </table>
        <Pagination
            :currentPage="currentPage"
            :totalItems="totalItems"
            @search="getAdvList($event)"
            v-if="totalItems > 0 "
        />
    </div>
    <AdviceModal v-if="modalState"  @closeModal = "modalState = $event" :lecProps="lecList" 
        @saveAndReload ="getAdvList()" :advProps="advDetail"/>
    <AdviceModalDetail v-if="mdetailState" @closeModal="mdetailState = $event" :advProps="advDetail"
    @saveAndReload ="getAdvList()"/>
    </div>
</template>



<script>
import axios from 'axios';
import Pagination from '@/components/common/PaginationComponent.vue';
import AdviceModal from './AdviceModal.vue';
import AdviceModalDetail from './AdviceModalDetail.vue';

export default {
    data() {
        return {
            lecList: [],
            advList: [],
            advDetail: {},
            currentPage: 0,
            totalItems: 0,
            lecId: '',
            modalState: false,
            mdetailState: false,
        };
    },
    methods: {
        getLecList() {   // 셀렉트박스 출력용 강의 목록 조회
            let param = new URLSearchParams();
            param.append('currentPage', 1);
            param.append('pageSize', 5);
            axios.post('/adv/lecList2.do', param).then((res) => {
                this.lecList = res.data.listData;
            })
        },
        getAdvList(cpage) {  // 상담 내역 조회
            cpage = cpage || 1;
            let param = new URLSearchParams();
            param.append('currentPage', cpage);
            param.append('pageSize', 5);
            param.append('lec_id', this.lecId);
            axios.post('/adv/advList2.do', param).then((res) => {
                this.advList = res.data.listData;
                this.currentPage = cpage;
                this.totalItems = res.data.listCnt;
                console.log("이벤트입니다 : ",event);

            })
        },
        openModal(type) {  // 모달창 띄우기
            (type === 'new' ? this.modalState = true : this.mdetailState = true);
        },
        getDetail(event) { // 상담 내역 상세내역 조회
            let param = new URLSearchParams();
            param.append('adv_id', event.target.getAttribute('data-adv-id'));
            param.append('lec_id', this.lecId);
            axios.post('/adv/advDetail.do', param).then((res) => {
                this.advDetail = res.data.data;
                this.openModal('detail'); //상세 내역 출력용 모달을 띄우기
            })
        },
    },
    computed: {
        userInfo() {
            return this.$store.getters.getLoginInfo;
        },
        currentDate() {
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            return `${year}${month}${day}`
        },
        checkDate() {
            const progress = [];
            this.lecList.map((item, index) => {
                if (item.end_date > this.currentDate) {
                    progress[index] = '(진행중)';
                } else {
                    progress[index] = '(종료)';
                }
            })
            return progress;
        },
    },
    mounted() {
        this.getLecList();
        this.getAdvList();
    },
    components: { Pagination, AdviceModal, AdviceModalDetail },
};

</script>

<style>

</style>

