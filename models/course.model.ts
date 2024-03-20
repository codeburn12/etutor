// Import necessary modules from Mongoose
import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies?: IComment[];
}

interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies?: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface IcourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

export interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: IcourseData[];
    rating?: number;
    purchased?: number;
}

const commentSchema = new Schema<IComment>({
    user: Object,
    question: String,
    questionReplies: [Object],
})

const reviewSchema = new Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [commentSchema],
});

const linkSchema = new Schema<ILink>({
    title: String,
    url: String,
})

const courseDataSchema = new Schema<IcourseData>({
    title: String,
    description: String,
    videoUrl: String,
    // videoThumbnail: Object,
    videoSection: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema],
})

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            // required: true,
            type: String,
        },
        url: {
            // required: true,
            type: String,
        }
    },
    tags: {
        type: String,
        require: true,
    },
    level: {
        type: String,
        require: true,
    },
    demoUrl: {
        type: String,
        require: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
})

const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;