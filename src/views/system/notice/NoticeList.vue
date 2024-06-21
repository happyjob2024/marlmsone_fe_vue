<template>
    <div id="notice">
        <p class="Location">
            <a href="/dashboard/home" class="btn_set home"></a>
            <span class="btn_nav bold">기준정보</span>
            <span class="btn_nav bold">공지사항 관리</span>
        </p>
        <p class="conTitle">
            <span>공지사항</span>
        </p>
            <div id="searchArea" style="display: flex; justify-content: space-around;">
    <table style="border: 1px #50bcdf;" width="100%" cellpadding="5" cellspacing="0" border="1" align="left" >
        <tr style="border: 0px; border-color: blue">
            <td width="50" height="25" style="font-size: 100%; text-align: left" >
                
                <span style="font-size: large; margin: 10px;" >검색 조건을 입력하세요</span>

                <input
                    type="text"
                    style="width: 200px; height: 40px; border-radius: 0.375rem; margin-right: 10px" 
                    v-model="paramObj.searchtitle"
                />
                
                <input
                    type="date"
                    style="width: 15%; height: 40px; border-radius: 0.375rem; padding: 0.375rem 0.75rem;
                        font-size: 1rem;"
                    v-model="paramObj.searchstdate"
                />
                ~
                <input
                    type="date"
                    style="width: 15%; height: 40px; border-radius: 0.375rem; padding: 0.375rem 0.75rem;
                        font-size: 1rem; margin-right: 10px;"
                    v-model="paramObj.searcheddate"
                />
                <span class="fr">
                    <a class="btn btn-primary mx-2" @click="getNoticeList()" style="margin-left: 10px;" >
                        <span>검 색</span>
                    </a>
                    <a class="btn btn-primary mx-2" v-show="(userType == 'C' || userType == 'B') "  @click="newNotice()">
                        <span>신규등록</span>
                    </a>
                </span>
            
            </td>
        </tr>
    </table>
</div>

        

        <div class="divComGrpCodList">
            <div style="float: left">
                <b> 총건수 : 0 현재 페이지 번호 : 0 </b>
            </div>
            <table class="col">
                <caption></caption>
                <colgroup>
                    <col width="10%" />
                    <col width="50%" />
                    <col width="20%" />
                    <col width="10%" />
                    <col width="10%" />
                </colgroup>

                <thead>
                    <tr>
                        <th scope="col">번호</th>
                        <th scope="col">제목</th>
                        <th scope="col">작성자</th>
                        <th scope="col">등록일</th>
                        <th scope="col">조회수</th>
                        
                    </tr>
                </thead>
                <tbody>
                    <template v-if="noticeList.length > 0">
                        <tr v-for="(list, i) in noticeList" :key="i">
                            <td>{{ i+1 }}</td>
                            <td @click="viewDetail(list.notice_id)">
                                {{ list.notice_tit }}</td>
                            <td>{{ list.name }}</td>
                            <td>{{ list.regdate }}</td>
                            <td>{{ list.hit }}</td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr>
                            <td colspan="7">일치하는 검색 결과가 없습니다</td>
                        </tr>
                    </template>
                </tbody>
            </table>
            <Pagination
                :currentPage="currentPage"
                :totalItems="totalItems"
                @search="getNoticeList($event)"
                v-if="totalItems > 0"
            />
        </div>
        <NoticeModal v-if="modalState" @closeModal="modalState=false" @closeAndreload="closeAndreload" :getNoticeList="getNoticeList" :selInfo="selInfo" :userType="userType" />
    </div>
</template>

<script>
import axios from 'axios';
import Pagination from '@/components/common/PaginationComponent.vue';
import NoticeModal from './NoticeModal.vue';

export default {
    data() {
        return {
            noticeList: [],
            selInfo: {},
            paramObj: { searchtitle: '', searchstdate: '', searcheddate: '' },
            currentPage: 0,
            totalItems: 0,
            modalState: false,
            modalProps: 0,
            userType: sessionStorage.userType,
        };
    },
    methods: {
        getNoticeList(cpage) {
            cpage = cpage || 1;

            let param = new URLSearchParams(this.paramObj);
            param.append('cpage', cpage);
            param.append('pagesize', 10);
            axios.post('/notice/noticelistjson.do', param).then((res) => {
                this.noticeList = res.data.listdata;
                this.currentPage = cpage;
                this.totalItems = res.data.listcnt;
            });
        },
        modalHandler() {
            this.modalState = true;
        },
        closeAndreload() {
            this.modalState = false;
            this.getNoticeList();
            
        },
        newNotice() {
            this.selInfo = {};
            this.modalHandler();
        },
        viewDetail(id) {          // 제목 클릭 시 상새목록 조회
            let param = new URLSearchParams();
            param.append('notice_id', id); 
            axios.post('/notice/noticeView.do', param).
                then((res) => {
                    this.selInfo = res.data.selinfo;
                })
            this.modalHandler();
        },
    },
    mounted() {
        this.getNoticeList();
    },
    updated() {
        
    },
    components: { Pagination, NoticeModal },
};
</script>

<style></style>