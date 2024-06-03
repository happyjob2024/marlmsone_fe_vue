import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import Dashboard from "../views/Dashboard.vue";
import Notice from "../views/system/Notice";
import SamplePage5 from "@/views/sampletest/SamplePage5.vue";
import LectureHandle from "@/views/sampletest/sampletest5/LectureHandle.vue";
import LectureRoomList from "@/views/adm/LectureRoomList.vue";
import EquipmentList from "@/views/adm/EquipmentList.vue";
import SurveyMgt from "../views/adm/SurveyMgt.vue";
import LectureList from "@/views/std/LectureList.vue";
import EquManagementList from "@/views/adm/EquManagementList.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Login,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    children: [
      {
        path: ":type/:menu",
        component: () => import("../views/Content.vue"),
      },
      {
        path: "home",
        component: () => import("../views/Home.vue"),
      },
      {
        path: "notice",
        children: [
          {
            path: "notice",
            component: <Notice />,
          },
        ],
      },
      {
        path: 'sampletest',
        children: [
          {
            path: 'samplepage5',
            component: <SamplePage5 />,
          },
          {
            path: 'detail/:id',
            component: <LectureHandle />,
          },
          {
            path: 'write',
            component: <LectureHandle />,
          },
        ],
      },
      {
        path: "adm",
        children: [
          {
            path: 'lectureRoom',
            component: <LectureRoomList />,
          },
          {
            path: 'Equipmentdetail/:id',
            component: <EquipmentList />,
          },
          {
            path: 'a_surveyControl',
            component: <SurveyMgt/>
          },
          {
            path: 'equManagement',
            component: <EquManagementList />
          },
        ],
      },
      {
        path: 'std',
        children: [
          {
            path: 'lectureList',
            component: <LectureList />
          },
        ],
      },
    ],
    component: Dashboard,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory("/"),
  routes,
});

export default router;
