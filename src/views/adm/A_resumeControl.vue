<script setup>
import Pagination from '@/components/common/PaginationComponent.vue';
import StudentResumeList from '@/components/adm/StudentResumeList.vue';
import { ResumeControl } from '@/api/api';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const currentPage = ref(1);
const pageSize = 5;
const totalCount = ref(0);
const name = ref('');
const lectureList = ref([]);

const hideResumeList = ref(true);
const resumeListRef = ref();

const search = (page) => {
    page = page || 1;

    const params = new URLSearchParams();
    params.append('currentPage', page);
    params.append('pageSize', pageSize);
    params.append('searchRoomName', name.value);

    axios
        .post(ResumeControl.LectureList, params)
        .then((res) => {
            totalCount.value = res.data.totalCount;
            lectureList.value = res.data.lectureList;
            currentPage.value = page;
        })
        .catch((_) => {
            alert('목록 불러오기를 실패했습니다.');
        });
};

const searchResumeList = (id) => {
    if (hideResumeList.value) hideResumeList.value = false;

    resumeListRef.value.setId(id);
};

onMounted(() => {
    search();
});
</script>

<template>
    <div class="content">
        <p class="Location">
            <a href="#" class="btn_set home">메인으로</a>
            <span class="btn_nav bold">취업 관리 / 이력서 관리</span>
            <a href="#" class="btn_set refresh">새로고침</a>
        </p>
        <p class="conTitle">
            <span>강의목록</span>
            <span class="search">
                <label> 강의명 </label>
                <input type="text" class="form-control" v-model="name" />
                <button class="btn btn-primary" @click="search()">검색</button>
            </span>
        </p>
        <table class="col">
            <colgroup>
                <col width="8%" />
                <col width="39%" />
                <col width="20%" />
                <col width="8%" />
                <col width="25%" />
            </colgroup>
            <thead>
                <tr>
                    <th scope="row">강의ID</th>
                    <th scope="row">강의명</th>
                    <th scope="row">담당 강사</th>
                    <th scope="row">수강인원</th>
                    <th scope="row">개강일/종강일</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lecture in lectureList" :key="lecture.lec_id">
                    <td>{{ lecture.lec_id }}</td>
                    <td>
                        <span
                            class="item"
                            @click="searchResumeList(lecture.lec_id)"
                            >{{ lecture.lec_name }}</span
                        >
                    </td>
                    <td>{{ lecture.tutor_id }}</td>
                    <td>{{ lecture.pre_pnum }}</td>
                    <td>{{ lecture.lectureDate }}</td>
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
            v-if="lectureList.length > 0"
            style="margin: 15px 0 30px 0"
        />
        <StudentResumeList
            :class="{ hide: hideResumeList }"
            ref="resumeListRef"
        />
    </div>
</template>

<style scoped>
.search {
    display: flex;
    align-items: center;
}

.search label {
    font-size: 16px;
    font-weight: bold;
    margin-right: 5px;
}

.search input {
    width: 200px;
    margin-right: 5px;
}

.item {
    cursor: pointer;
    color: black;
}

.item:hover {
    text-decoration: underline;
}

.hide {
    display: none;
}
</style>
