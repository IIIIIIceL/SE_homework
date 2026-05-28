import { useEffect, useState } from 'react';
import { readerService } from '../../services/readerService';
import styles from '../Readers/Readers.module.css';

const STATUS_LABELS = { ACTIVE: '正常', INACTIVE: '停用', DELETED: '已删除' };
const GENDER_LABELS = { UNKNOWN: '未知', MALE: '男', FEMALE: '女' };

export default function ReaderProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function loadProfile() {
    setLoading(true);
    setError('');
    try {
      const data = await readerService.getMyProfile();
      setProfile(data);
      setForm({ phone: data.phone || '', email: data.email || '' });
    } catch (requestError) {
      setError(requestError.response?.data?.error || '获取个人资料失败');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProfile(); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await readerService.updateMyContact(form);
      await loadProfile();
    } catch (requestError) {
      setError(requestError.response?.data?.error || '保存联系方式失败');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className={styles.loading}>正在加载个人资料...</div>;
  if (error && !profile) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}><div><h2>个人资料</h2><p>查看自己的读者档案，并维护联系方式。</p></div></div>
      {error ? <div className={styles.error}>{error}</div> : null}
      <section className={styles.panel}>
        <h3 className={styles.sectionTitle}>读者档案</h3>
        <dl className={styles.detailGrid}>
          <div className={styles.detailItem}><dt>读者编号</dt><dd>{profile?.readerNo || '-'}</dd></div>
          <div className={styles.detailItem}><dt>姓名</dt><dd>{profile?.name || '-'}</dd></div>
          <div className={styles.detailItem}><dt>状态</dt><dd>{STATUS_LABELS[profile?.status] || profile?.status || '-'}</dd></div>
          <div className={styles.detailItem}><dt>性别</dt><dd>{GENDER_LABELS[profile?.gender] || profile?.gender || '-'}</dd></div>
          <div className={styles.detailItem}><dt>院系</dt><dd>{profile?.department || '-'}</dd></div>
          <div className={styles.detailItem}><dt>班级</dt><dd>{profile?.className || '-'}</dd></div>
          <div className={styles.detailItem}><dt>最大借阅数</dt><dd>{profile?.maxBorrowCount || '-'}</dd></div>
        </dl>
      </section>
      <section className={styles.panel}>
        <h3 className={styles.sectionTitle}>联系方式</h3>
        <form className={styles.formGrid} onSubmit={handleSubmit}>
          <label className={styles.field}><span>手机号</span><input className={styles.input} value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} /></label>
          <label className={styles.field}><span>邮箱</span><input className={styles.input} value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} /></label>
          <div className={styles.footer}><button className={styles.primaryBtn} disabled={submitting}>{submitting ? '保存中...' : '保存联系方式'}</button></div>
        </form>
      </section>
    </div>
  );
}
