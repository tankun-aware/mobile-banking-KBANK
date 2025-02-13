import { test, expect } from '@playwright/test';
import { common, aisReport, paymentOrder, paymentOrderValidators, mockMobilebanking, data } from '../../fixtures/import';

test.describe('[Integration Tests] Redirect encode test ', () => {
    test(`TC_RE_001 Redirect encode test with (space)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, ' ');
    });

    test(`TC_RE_002 Redirect encode test with (!)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '!');
    });

    test(`TC_RE_003 Redirect encode test with (")`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `"`);
    });
    
    test(`TC_RE_004 Redirect encode test with (#)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '#');
    });

    test(`TC_RE_005 Redirect encode test with ($)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '$');
    });

    test(`TC_RE_006 Redirect encode test with (%)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '%');
    });

    test(`TC_RE_007 Redirect encode test with (&)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '&');
    });

    test(`TC_RE_008 Redirect encode test with (')`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `'`);
    });

    test(`TC_RE_009 Redirect encode test with [(]`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '(');
    });

    test(`TC_RE_010 Redirect encode test with [)]`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, ')');
    });

    test(`TC_RE_011 Redirect encode test with (*)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `*`);
    });

    test(`TC_RE_012 Redirect encode test with (+)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `+`);
    });

    test(`TC_RE_013 Redirect encode test with (,)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `,`);
    });

    test(`TC_RE_014 Redirect encode test with (-)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `-`);
    });

    test(`TC_RE_015 Redirect encode test with (.)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `.`);
    });

    test(`TC_RE_016 Redirect encode test with (/)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `/`);
    });

    test(`TC_RE_017 Redirect encode test with (:)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `:`);
    });

    test(`TC_RE_018 Redirect encode test with (;)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `;`);
    });

    test(`TC_RE_019 Redirect encode test with (<)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `>`);
    });

    test(`TC_RE_020 Redirect encode test with (=)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `=`);
    });

    test(`TC_RE_021 Redirect encode test with (>)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `>`);
    });


    test(`TC_RE_022 Redirect encode test with (?)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `?`);
    });


    test(`TC_RE_023Redirect encode test with (@)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `@`);
    });

    test(`TC_RE_024 Redirect encode test with ([)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `[`);
    });

    test(`TC_RE_025 Redirect encode test with (\\)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '\\');
    });

    test(`TC_RE_026 Redirect encode test with (])`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `]`);
    });

    test(`TC_RE_027 Redirect encode test with (^)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `^`);
    });

    test(`TC_RE_028 Redirect encode test with (_)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `_`);
    });

    test('TC_RE_029 Redirect encode test with (`)', async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, '`');
    });

    test(`TC_RE_030 Redirect encode test with ({)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `{`);
    });

    test(`TC_RE_031 Redirect encode test with (|)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `|`);
    });

    test(`TC_RE_032 Redirect encode test with (})`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `}`);
    });

    test(`TC_RE_033 Redirect encode test with (~)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `~`);
    });

    test(`TC_RE_034 Redirect encode test with (‘)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `‘`);
    });

    test(`TC_RE_035 Redirect encode test with (’)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `’`);
    });

    test(`TC_RE_036 Redirect encode test with (“)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `“`);
    });

    test(`TC_RE_037 Redirect encode test with (”)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `”`);
    });

    test(`TC_RE_038 Redirect encode test with (€)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `€`);
    });

    test(`TC_RE_039 Redirect encode test with ()`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, ``);
    });

    test(`TC_RE_040 Redirect encode test with (‚)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `‚`);
    });

    test(`TC_RE_041 Redirect encode test with (ƒ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ƒ`);
    });

    test(`TC_RE_042 Redirect encode test with („)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `„`);
    });

    test(`TC_RE_043 Redirect encode test with (…)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `…`);
    });

    test(`TC_RE_044 Redirect encode test with (†)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `†`);
    });

    test(`TC_RE_045 Redirect encode test with (‡)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `‡`);
    });

    test(`TC_RE_046 Redirect encode test with (ˆ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ˆ`);
    });

    test(`TC_RE_047 Redirect encode test with (‰)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `‰`);
    });

    test(`TC_RE_048 Redirect encode test with (Š)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Š`);
    });

    test(`TC_RE_049 Redirect encode test with (‹)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `‹`);
    });

    test(`TC_RE_050 Redirect encode test with (Œ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Œ`);
    });

    test(`TC_RE_051 Redirect encode test with ()`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, ``);
    });

    test(`TC_RE_052 Redirect encode test with (Ž)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ž`);
    });

    test(`TC_RE_053 Redirect encode test with ()`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, ``);
    });

    test(`TC_RE_054 Redirect encode test with ()`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, ``);
    });

    test(`TC_RE_055 Redirect encode test with (•)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `•`);
    });

    test(`TC_RE_056 Redirect encode test with (–)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `–`);
    });

    test(`TC_RE_057 Redirect encode test with (—)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `—`);
    });

    test(`TC_RE_058 Redirect encode test with (˜)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `˜`);
    });

    test(`TC_RE_059 Redirect encode test with (™)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `™`);
    });

    test(`TC_RE_060 Redirect encode test with (š)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `š`);
    });

    test(`TC_RE_061 Redirect encode test with (›)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `›`);
    });

    test(`TC_RE_062 Redirect encode test with (œ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `œ`);
    });

    test(`TC_RE_063 Redirect encode test with ()`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, ``);
    });

    test(`TC_RE_064 Redirect encode test with (ž)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ž`);
    });

    test(`TC_RE_065 Redirect encode test with (Ÿ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ÿ`);
    });

    test(`TC_RE_066 Redirect encode test with (¡)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¡`);
    });

    test(`TC_RE_067 Redirect encode test with (¢)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¢`);
    });

    test(`TC_RE_068 Redirect encode test with (£)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `£`);
    });

    test(`TC_RE_069 Redirect encode test with (¤)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¤`);
    });

    test(`TC_RE_070 Redirect encode test with (¥)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¥`);
    });

    test(`TC_RE_071 Redirect encode test with (¦)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¦`);
    });

    test(`TC_RE_072 Redirect encode test with (§)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `§`);
    });

    test(`TC_RE_073 Redirect encode test with (¨)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¨`);
    });

    test(`TC_RE_074 Redirect encode test with (©)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `©`);
    });

    test(`TC_RE_075 Redirect encode test with (ª)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ª`);
    });

    test(`TC_RE_076 Redirect encode test with («)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `«`);
    });

    test(`TC_RE_077 Redirect encode test with (¬)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¬`);
    });

    test(`TC_RE_078 Redirect encode test with (®)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `®`);
    });

    test(`TC_RE_079 Redirect encode test with (¯)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¯`);
    });

    test(`TC_RE_080 Redirect encode test with (°)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `°`);
    });

    test(`TC_RE_081 Redirect encode test with (±)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `±`);
    });

    test(`TC_RE_082 Redirect encode test with (²)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `²`);
    });

    test(`TC_RE_083 Redirect encode test with (³)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `³`);
    });

    test(`TC_RE_084 Redirect encode test with (´)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `´`);
    });

    test(`TC_RE_085 Redirect encode test with (µ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `µ`);
    });

    test(`TC_RE_086 Redirect encode test with (¶)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¶`);
    });

    test(`TC_RE_087 Redirect encode test with (·)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `·`);
    });

    test(`TC_RE_088 Redirect encode test with (¸)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¸`);
    });

    test(`TC_RE_089 Redirect encode test with (¹)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¹`);
    });

    test(`TC_RE_090 Redirect encode test with (º)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `º`);
    });

    test(`TC_RE_091 Redirect encode test with (»)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `»`);
    });

    test(`TC_RE_092 Redirect encode test with (¼)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¼`);
    });

    test(`TC_RE_093 Redirect encode test with (½)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `½`);
    });

    test(`TC_RE_094 Redirect encode test with (¾)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¾`);
    });

    test(`TC_RE_095 Redirect encode test with (¿)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `¿`);
    });

    test(`TC_RE_096 Redirect encode test with (À)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `À`);
    });

    test(`TC_RE_097 Redirect encode test with (Á)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Á`);
    });
    
    test(`TC_RE_098 Redirect encode test with (Â)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Â`);
    });

    test(`TC_RE_099 Redirect encode test with (Ã)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ã`);
    });

    test(`TC_RE_100 Redirect encode test with (Ä)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ä`);
    });

    test(`TC_RE_101 Redirect encode test with (Å)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Å`);
    });

    test(`TC_RE_102 Redirect encode test with (Æ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Æ`);
    });

    test(`TC_RE_103 Redirect encode test with (Ç)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ç`);
    });

    test(`TC_RE_104 Redirect encode test with (È)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `È`);
    });

    test(`TC_RE_105 Redirect encode test with (É)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `É`);
    });

    test(`TC_RE_106 Redirect encode test with (Ê)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ê`);
    });

    test(`TC_RE_107 Redirect encode test with (Ë)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ë`);
    });

    test(`TC_RE_108 Redirect encode test with (Ì)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ì`);
    });

    test(`TC_RE_109 Redirect encode test with (Í)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Í`);
    });

    test(`TC_RE_110 Redirect encode test with (Î)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Î`);
    });

    test(`TC_RE_111 Redirect encode test with (Ï)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ï`);
    });

    test(`TC_RE_112 Redirect encode test with (Ð)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ð`);
    });

    test(`TC_RE_113 Redirect encode test with (Ñ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ñ`);
    });

    test(`TC_RE_114 Redirect encode test with (Ò)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ò`);
    });

    test(`TC_RE_115 Redirect encode test with (Ó)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ó`);
    });

    test(`TC_RE_116 Redirect encode test with (Ô)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ô`);
    });

    test(`TC_RE_117 Redirect encode test with (Õ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Õ`);
    });

    test(`TC_RE_118 Redirect encode test with (Ö)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ö`);
    });

    test(`TC_RE_119 Redirect encode test with (×)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `×`);
    });

    test(`TC_RE_120 Redirect encode test with (Ø)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ø`);
    });

    test(`TC_RE_121 Redirect encode test with (Ù)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ù`);
    });

    test(`TC_RE_122 Redirect encode test with (Ú)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ú`);
    });

    test(`TC_RE_123 Redirect encode test with (Û)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Û`);
    });

    test(`TC_RE_124 Redirect encode test with (Ü)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ü`);
    });

    test(`TC_RE_125 Redirect encode test with (Ý)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Ý`);
    });

    test(`TC_RE_126 Redirect encode test with (Þ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `Þ`);
    });

    test(`TC_RE_127 Redirect encode test with (ß)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ß`);
    });

    test(`TC_RE_128 Redirect encode test with (à)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `à`);
    });

    test(`TC_RE_129 Redirect encode test with (á)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `á`);
    });

    test(`TC_RE_130 Redirect encode test with (â)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `â`);
    });

    test(`TC_RE_131 Redirect encode test with (ã)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ã`);
    });

    test(`TC_RE_132 Redirect encode test with (ä)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ä`);
    });

    test(`TC_RE_133 Redirect encode test with (å)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `å`);
    });

    test(`TC_RE_134 Redirect encode test with (æ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `æ`);
    });

    test(`TC_RE_135 Redirect encode test with (ç)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ç`);
    });

    test(`TC_RE_136 Redirect encode test with (è)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `è`);
    });

    test(`TC_RE_137 Redirect encode test with (é)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `é`);
    });

    test(`TC_RE_138 Redirect encode test with (ê)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ê`);
    });

    test(`TC_RE_139 Redirect encode test with (ë)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ë`);
    });

    test(`TC_RE_140 Redirect encode test with (ì)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ì`);
    });

    test(`TC_RE_141 Redirect encode test with (í)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `í`);
    });

    test(`TC_RE_142 Redirect encode test with (î)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `î`);
    });

    test(`TC_RE_143 Redirect encode test with (ï)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ï`);
    });

    test(`TC_RE_144 Redirect encode test with (ð)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ð`);
    });

    test(`TC_RE_145 Redirect encode test with (ñ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ñ`);
    });

    test(`TC_RE_146 Redirect encode test with (ò)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ò`);
    });

    test(`TC_RE_147 Redirect encode test with (ó)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ó`);
    });

    test(`TC_RE_148 Redirect encode test with (ô)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ô`);
    });

    test(`TC_RE_149 Redirect encode test with (õ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `õ`);
    });

    test(`TC_RE_150 Redirect encode test with (ö)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ö`);
    });

    test(`TC_RE_151 Redirect encode test with (÷)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `÷`);
    });

    test(`TC_RE_152 Redirect encode test with (ø)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ø`);
    });

    test(`TC_RE_153 Redirect encode test with (ù)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ù`);
    });

    test(`TC_RE_154 Redirect encode test with (ú)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ú`);
    });

    test(`TC_RE_155 Redirect encode test with (û)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `û`);
    });

    test(`TC_RE_156 Redirect encode test with (ü)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ü`);
    });

    test(`TC_RE_157 Redirect encode test with (ý)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ý`);
    });

    test(`TC_RE_158 Redirect encode test with (þ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `þ`);
    });

    test(`TC_RE_159 Redirect encode test with (ÿ)`, async ({ page, request }) => {
        await paymentOrder.redirectEncodeTest(page, `ÿ`);
    });
});


