import createReducer from './../lib/createReducer';
import * as types from './../actions/types';

export const booking = createReducer(
  {
    baseBookingList: [],
    bookingTemplateList: [],
    bookingList: [],
    campaignInventoryList: [],
    assignmentList: {},
  },
  {
    [types.POST_BASE_BOOKING_START](state) {
      return {
        ...state,
        isCreatingBaseBooking: true,
        postBaseBookingSuccess: false,
        postBaseBookingError: false,
      };
    },
    [types.POST_BASE_BOOKING_SUCCESS](state) {
      return {
        ...state,
        isCreatingBaseBooking: false,
        postBaseBookingSuccess: true,
      };
    },
    [types.POST_BASE_BOOKING_FAIL](state) {
      return {
        ...state,
        isCreatingBaseBooking: false,
        postBaseBookingError: true,
      };
    },
    [types.PUT_BASE_BOOKING_START](state) {
      return {
        ...state,
        isUpdatingBaseBooking: true,
        putBaseBookingSuccess: false,
        putBaseBookingError: false,
      };
    },
    [types.PUT_BASE_BOOKING_SUCCESS](state) {
      return {
        ...state,
        isUpdatingBaseBooking: false,
        putBaseBookingSuccess: true,
      };
    },
    [types.PUT_BASE_BOOKING_FAIL](state) {
      return {
        ...state,
        isUpdatingBaseBooking: false,
        putBaseBookingError: true,
      };
    },
    [types.GET_BASE_BOOKING_LIST_START](state) {
      return {
        ...state,
        isFetchingBaseBooking: true,
      };
    },
    [types.GET_BASE_BOOKING_LIST_SUCCESS](state, action) {
      return {
        ...state,
        isFetchingBaseBooking: false,
        baseBookingList: action.list,
      };
    },
    [types.GET_BASE_BOOKING_LIST_FAIL](state) {
      return {
        ...state,
        isFetchingBaseBooking: false,
        baseBookingList: [],
      };
    },
    [types.DELETE_BASE_BOOKING_START](state) {
      return {
        ...state,
        isDeletingBaseBooking: true,
      };
    },
    [types.DELETE_BASE_BOOKING_SUCCESS](state, action) {
      const { baseBookingList } = state;
      return {
        ...state,
        isDeletingBaseBooking: false,
        baseBookingList: baseBookingList.filter((item) => item.id !== action.id),
      };
    },
    [types.DELETE_BASE_BOOKING_FAIL](state) {
      return {
        ...state,
        isDeletingBaseBooking: false,
      };
    },
    [types.GET_BOOKING_TEMPLATE_LIST_START](state) {
      return {
        ...state,
        isFetchingBookingTemplate: true,
      };
    },
    [types.GET_BOOKING_TEMPLATE_LIST_SUCCESS](state, action) {
      return {
        ...state,
        isFetchingBookingTemplate: false,
        bookingTemplateList: action.list,
      };
    },
    [types.GET_BOOKING_TEMPLATE_LIST_FAIL](state) {
      return {
        ...state,
        isFetchingBookingTemplate: false,
        bookingTemplateList: [],
      };
    },
    [types.POST_BOOKING_TEMPLATE_START](state) {
      return {
        ...state,
        isCreatingBookingTemplate: true,
        postBookingTemplateSuccess: false,
        postBookingTemplateError: false,
      };
    },
    [types.POST_BOOKING_TEMPLATE_SUCCESS](state) {
      return {
        ...state,
        isCreatingBookingTemplate: false,
        postBookingTemplateSuccess: true,
      };
    },
    [types.POST_BOOKING_TEMPLATE_FAIL](state) {
      return {
        ...state,
        isCreatingBookingTemplate: false,
        postBookingTemplateError: true,
      };
    },
    [types.PUT_BOOKING_TEMPLATE_START](state) {
      return {
        ...state,
        isUpdatingBookingTemplate: true,
        putBookingTemplateSuccess: false,
        putBookingTemplateError: false,
      };
    },
    [types.PUT_BOOKING_TEMPLATE_SUCCESS](state) {
      return {
        ...state,
        isUpdatingBookingTemplate: false,
        putBookingTemplateSuccess: true,
      };
    },
    [types.PUT_BOOKING_TEMPLATE_FAIL](state) {
      return {
        ...state,
        isUpdatingBookingTemplate: false,
        putBookingTemplateError: true,
      };
    },
    [types.DELETE_BOOKING_TEMPLATE_START](state) {
      return {
        ...state,
        isDeletingBookingTemplate: true,
      };
    },
    [types.DELETE_BOOKING_TEMPLATE_SUCCESS](state, action) {
      const { bookingTemplateList } = state;
      return {
        ...state,
        isDeletingBookingTemplate: false,
        bookingTemplateList: bookingTemplateList.filter((item) => item.id !== action.id),
      };
    },
    [types.DELETE_BOOKING_TEMPLATE_FAIL](state) {
      return {
        ...state,
        isDeletingBookingTemplate: false,
      };
    },
    [types.GET_BOOKING_START](state) {
      return {
        ...state,
        isFetchingBooking: true,
      };
    },
    [types.GET_BOOKING_SUCCESS](state, action) {
      return {
        ...state,
        isFetchingBooking: false,
        bookingList: action.list,
      };
    },
    [types.GET_BOOKING_FAIL](state) {
      return {
        ...state,
        isFetchingBooking: false,
        bookingList: [],
      };
    },
    [types.POST_BOOKING_START](state) {
      return {
        ...state,
        isCreatingBooking: true,
        postBookingSuccess: false,
        postBookingError: false,
      };
    },
    [types.POST_BOOKING_SUCCESS](state) {
      return {
        ...state,
        isCreatingBooking: false,
        postBookingSuccess: true,
      };
    },
    [types.POST_BOOKING_FAIL](state) {
      return {
        ...state,
        isCreatingBooking: false,
        postBookingError: true,
      };
    },
    [types.PUT_BOOKING_START](state) {
      return {
        ...state,
        isUpdatingBooking: true,
        putBookingSuccess: false,
        putBookingError: false,
      };
    },
    [types.PUT_BOOKING_SUCCESS](state) {
      return {
        ...state,
        isUpdatingBooking: false,
        putBookingSuccess: true,
      };
    },
    [types.PUT_BOOKING_FAIL](state) {
      return {
        ...state,
        isUpdatingBooking: false,
        putBookingError: true,
      };
    },
    [types.DELETE_BOOKING_START](state) {
      return {
        ...state,
        isDeletingBooking: true,
      };
    },
    [types.DELETE_BOOKING_SUCCESS](state, action) {
      const { bookingList } = state;
      return {
        ...state,
        isDeletingBooking: false,
        bookingList: bookingList.filter((item) => item.id !== action.id),
      };
    },
    [types.DELETE_BOOKING_FAIL](state) {
      return {
        ...state,
        isDeletingBooking: false,
      };
    },
    [types.GET_CAMPAIGN_INVENTORY_START](state) {
      return {
        ...state,
        isFetchingCampaignInventory: true,
      };
    },
    [types.GET_CAMPAIGN_INVENTORY_SUCCESS](state, action) {
      return {
        ...state,
        isFetchingCampaignInventory: false,
        campaignInventoryList: action.list,
      };
    },
    [types.GET_CAMPAIGN_INVENTORY_FAIL](state) {
      return {
        ...state,
        isFetchingCampaignInventory: false,
        campaignInventoryList: [],
      };
    },
    [types.GET_ASSIGNMENT_START](state) {
      return {
        ...state,
        isFetchingAssignment: true,
      };
    },
    [types.GET_ASSIGNMENT_SUCCESS](state, action) {
      const assignmentList = {};
      console.log(action.list);

      let key = '';
      let activityIndex = {
        RELEASE: 0,
        CLOSURE: 0,
        AUDIT: 0,
      };
      for (let i = 0, l = action.list.length; i < l; i += 1) {
        key = `${action.list[i].supplier_id}-${action.list[i].inventory_name}`;
        if (!assignmentList[key]) {
          assignmentList[key] = {
            RELEASE: [],
            CLOSURE: [],
            AUDIT: [],
          };
        }
        activityIndex[action.list[i].activity_type] += 1;
        let index = activityIndex[action.list[i].activity_type];

        assignmentList[key][action.list[i].activity_type].push({
          ...action.list[i],
          inventory_name: `${action.list[i].inventory_name} ${index}`,
        });
      }
      return {
        ...state,
        isFetchingAssignment: false,
        assignmentList,
      };
    },
    [types.GET_ASSIGNMENT_FAIL](state) {
      return {
        ...state,
        isFetchingAssignment: false,
        assignmentList: {},
      };
    },
    [types.POST_ASSIGNMENT_START](state) {
      return {
        ...state,
        isCreatingAssignment: true,
        postAssignmentSuccess: false,
        postAssignmentError: false,
      };
    },
    [types.POST_ASSIGNMENT_SUCCESS](state) {
      return {
        ...state,
        isCreatingAssignment: false,
        postAssignmentSuccess: true,
      };
    },
    [types.POST_ASSIGNMENT_FAIL](state) {
      return {
        ...state,
        isCreatingAssignment: false,
        postAssignmentError: true,
      };
    },
    [types.PUT_ASSIGNMENT_START](state) {
      return {
        ...state,
        isUpdatingAssignment: true,
        putAssignmentSuccess: false,
        putAssignmentError: false,
      };
    },
    [types.PUT_ASSIGNMENT_SUCCESS](state) {
      return {
        ...state,
        isUpdatingAssignment: false,
        putAssignmentSuccess: true,
      };
    },
    [types.PUT_ASSIGNMENT_FAIL](state) {
      return {
        ...state,
        isUpdatingAssignment: false,
        putAssignmentError: true,
      };
    },
    [types.UPLOAD_IMAGE_START](state) {
      return {
        ...state,
        isUploadingImage: true,
        uploadImageSuccess: false,
        uploadImageError: false,
      };
    },
    [types.UPLOAD_IMAGE_SUCCESS](state) {
      return {
        ...state,
        isUploadingImage: false,
        uploadImageSuccess: true,
      };
    },
    [types.UPLOAD_IMAGE_FAIL](state) {
      return {
        ...state,
        isUploadingImage: false,
        uploadImageError: true,
      };
    },
    [types.UPLOAD_HASHTAG_IMAGE_START](state) {
      return {
        ...state,
        isUploadingImage: true,
        uploadImageSuccess: false,
        uploadImageError: false,
      };
    },
    [types.UPLOAD_HASHTAG_IMAGE_SUCCESS](state) {
      return {
        ...state,
        isUploadingImage: false,
        uploadImageSuccess: true,
      };
    },
    [types.UPLOAD_HASHTAG_IMAGE_FAIL](state) {
      return {
        ...state,
        isUploadingImage: false,
        uploadImageError: true,
      };
    },
  }
);

export { booking as default };
