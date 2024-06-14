<template>
    <div id="notice">
        <p class="Location">
            <a href="/dashboard/home" class="btn_set home"></a>
            <span class="btn_nav bold">커뮤니티</span>
            <span class="btn_nav bold">Q&A</span>
        </p>
        <p class="conTitle">
            <span>Q&A 게시판</span>
        </p>
        <div id="searchArea" style="display: flex; justify-content: space-around;">
            <table style="border: 1px #50bcdf;" width="100%" cellpadding="5" cellspacing="0" border="1" align="left" >
                <tr style="border: 0px; border-color: blue">
                    <td width="50" height="25" style="font-size: 100%; text-align: end" >
                
                        <span style="font-size: large; margin: 10px;" >제목</span>

                        <input
                            type="text"
                            style="width: 200px; height: 40px; border-radius: 0.375rem; margin-right: 10px"
                            v-model="searchtitle"
                        />
                
                        <span class="fr">
                            <a class="btn btn-primary mx-2" style="margin-left: 10px;" >
                                <span @click="getQnAList()">검 색</span>
                            </a>
                            <a class="btn btn-primary mx-2">
                                <span @click="modalHandler()">글쓰기</span>
                            </a>
                        </span>
            
                    </td>
                </tr>
            </table>
        </div>

        <div class="divComGrpCodList">
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
                    <tr v-for="data in dataList" :key="data.qna_id">
                        <td>{{ data.qna_id }}</td>
                        <td @click="modalHandler(data.qna_id)">{{ data.qna_title }}</td>
                        <td>{{ data.loginID }}</td>
                        <td>{{ data.regdate }}</td>
                        <td>{{ data.hit }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Pagination 
            :currentPage="currentPage"
            :totalItems="listCount"
            @search="getQnAList($event)"
            v-if="dataList.length > 0"
        />
        <QnAModal
            v-if="modalBoolean"
            :qna_id="qna_id"
            @closeModal="modalBoolean=$event"
            @getQnAList="getQnAList"
        />
    </div>
</template>

<script setup>
import Pagination from '../components/common/PaginationComponent.vue';
import QnAModal from './QnAModal.vue';
import axios from "axios";
import { onMounted, ref, watch } from "vue";

    const dataList = ref([]);
    const listCount = ref(0);
    const currentPage = ref(0);
    const searchtitle = ref('');
    const modalBoolean = ref(false);
    const qna_id = ref(0);

    const getQnAList = (page) => {
        page = page || 1;
        let param = new URLSearchParams();
        param.append('cpage', page);
        param.append('pagesize', 10);
        param.append('searchtitle', searchtitle.value);

        axios.post('/qandaList.do', param).then((res) => {
            dataList.value = res.data.listData;
            listCount.value = res.data.listcnt;
            currentPage.value = page;
        });
    };

    const modalHandler = (param) => {
        modalBoolean.value = true;
        qna_id.value = param;
    }

    onMounted(() => {
        getQnAList();
    });

    watch(modalBoolean, () => {
        getQnAList();
    });

</script>

<style>

</style>