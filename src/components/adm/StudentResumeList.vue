<script setup>
import { ResumeControl } from '@/api/api';
import Pagination from '@/components/common/PaginationComponent.vue';
import axios from 'axios';
import { ref } from 'vue';

const currentPage = ref(1);
const pageSize = 5;
const totalCount = ref(0);
const resumeList = ref([]);

const lectureId = ref(0);
const key = ref('');
const value = ref('');

const search = (page) => {
    page = page || 1;

    const params = new URLSearchParams();
    params.append('lectureId', lectureId.value);
    params.append('currentPage', page);
    params.append('pageSize', pageSize);
    params.append('searchKey', key.value);
    params.append('searchValue', value.value);

    axios
        .post(ResumeControl.StudentResumeList, params)
        .then((res) => {
            totalCount.value = res.data.totalCount;
            resumeList.value = res.data.studentResumeList;
            currentPage.value = page;
        })
        .catch((_) => {
            alert('목록 불러오기에 실패했습니다.');
        });
};

const setId = (id) => {
    lectureId.value = id;

    search();
};

defineExpose({ setId });
</script>

<template>
    <div>
        <p class="conTitle">
            <span>수강생 이력서 목록</span>
            <span class="search">
                <select class="form-select" v-model="key">
                    <option value="">전체</option>
                    <option value="studentName">이름</option>
                    <option value="studentId">아이디</option>
                    <option value="studentTel">전화번호</option>
                </select>
                <input type="text" class="form-control" v-model="value" />
                <button class="btn btn-primary" @click="search()">검색</button>
            </span>
        </p>
        <table class="col">
            <colgroup>
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">학생 이름</th>
                    <th scope="col">학생 ID</th>
                    <th scope="col">학생 전화번호</th>
                    <th scope="col">이메일</th>
                    <th scope="col">이력서 유무</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="resume in resumeList" :key="resume.studentId">
                    <td>{{ resume.studentName }}</td>
                    <td>{{ resume.studentId }}</td>
                    <td>{{ resume.studentTel }}</td>
                    <td>{{ resume.studentMail }}</td>
                    <td>{{ resume.resumeFileName ? 'O' : 'X' }}</td>
                </tr>
            </tbody>
        </table>
        <Pagination
            v-bind="{
                currentPage,
                totalItems: totalCount,
                itemsPerPage: pageSize,
            }"
            @search="search($event)"
            v-if="resumeList.length > 0"
            style="margin-top: 15px"
        />
    </div>
</template>

<style scoped>
.search select {
    width: 105px;
}
</style>
