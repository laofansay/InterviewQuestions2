const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.getHistory = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('watch_history')
            .select('*')
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.addHistory = async (req, res) => {
    const { video_id, progress } = req.body;
    try {
        const { data, error } = await supabase
            .from('watch_history')
            .upsert({
                user_id: req.user.id,
                video_id,
                progress,
                last_watched: new Date()
            });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};