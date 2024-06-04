<script setup>
import { nullcheck } from '@/common/common';
import { Employ } from '@/api/api';
import axios from 'axios';
import { ref } from 'vue';

const props = defineProps({
    info: {
        id: Number,
        name: String,
        company: String,
        tel: String,
        startDate: String,
        endDate: String,
    },
});
const emit = defineEmits(['closeModal']);

const company = ref(props.info.company);
const startDate = ref(props.info.startDate);
const endDate = ref(props.info.endDate);

const closeModal = (event) => {
    if (!event) {
        emit('closeModal');
    } else if (event.target.classList.contains('background')) {
        emit('closeModal');
    }
};

const saveHandler = () => {
    const checkresult = nullcheck([
        { inval: company.value, msg: '회사명을 입력해 주세요.' },
        { inval: startDate.value, msg: '입사일을 입력해 주세요.' },
    ]);
    if (!checkresult) return;

    const params = new URLSearchParams({
        action: props.info.action,
        std_id: props.info.id,
        comp_name: company.value,
        employ_day: startDate.value,
        resign_day: endDate.value ? endDate.value : '',
    });

    axios
        .post(Employ.Post, params)
        .then((res) => {
            if (res.data.result === 'SUCCESS') {
                alert(res.data.resultMsg);
                emit('closeModal', {
                    id: props.info.id,
                    company: company.value,
                    startDate: startDate.value,
                    endDate: endDate.value ? endDate.value : '',
                });
            } else {
                alert(res.data.resultMsg);
            }
        })
        .catch((_) => {
            alert('실패했습니다.');
        });
};
</script>

<template>
    <div class="modal show">
        <div class="background" @click="closeModal">
            <div class="main">
                <p class="conTitle">
                    <span>{{
                        props.info.action === 'I' ? '취업 등록' : '취업 수정'
                    }}</span>
                </p>
                <table>
                    <colgroup>
                        <col width="25%" />
                        <col width="75%" />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>학생명</th>
                            <td>
                                <input
                                    type="text"
                                    class="form-control"
                                    :value="props.info.name"
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>회사명<span class="font_red"> *</span></th>
                            <td>
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="company"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>연락처</th>
                            <td>
                                <input
                                    type="text"
                                    class="form-control"
                                    :value="props.info.tel"
                                    disabled
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>입사일 <span class="font_red"> *</span></th>
                            <td>
                                <input
                                    type="date"
                                    class="form-control"
                                    v-model="startDate"
                                />
                            </td>
                        </tr>
                        <tr v-if="props.info.action !== 'I'">
                            <th>퇴사일</th>
                            <td>
                                <input
                                    type="date"
                                    class="form-control"
                                    v-model="endDate"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="buttons">
                    <button class="btn btn-primary" @click="saveHandler()">
                        {{ props.info.action === 'I' ? '등록' : '수정' }}
                    </button>
                    <button class="btn btn-primary" @click="closeModal()">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
table {
    width: 550px;
}
</style>
